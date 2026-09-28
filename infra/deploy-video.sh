#!/usr/bin/env bash
set -euo pipefail

if [[ "${SANIFU_VIDEO_RIGHTS_CONFIRMED:-}" != "1" ]]; then
  echo "Set SANIFU_VIDEO_RIGHTS_CONFIRMED=1 only for a video Sanifu may publish and rehost." >&2
  exit 2
fi

video_file="${1:-}"
if [[ ! -f "$video_file" ]]; then
  echo "Usage: SANIFU_VIDEO_RIGHTS_CONFIRMED=1 AWS_REGION=<region> $0 <licensed-video.mp4>" >&2
  exit 2
fi

region="${AWS_REGION:-${AWS_DEFAULT_REGION:-}}"
if [[ -z "$region" ]]; then
  echo "Set AWS_REGION to the intended AWS region." >&2
  exit 2
fi

for command in aws curl ffprobe shasum; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "Missing required command: $command" >&2
    exit 2
  fi
done

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
stack_name="${SANIFU_VIDEO_STACK:-sanifu-video}"

ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 "$video_file" >/dev/null
codec="$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$video_file")"
if [[ "$codec" != "h264" ]]; then
  echo "Expected an H.264 MP4 for broad browser support; found: $codec" >&2
  exit 2
fi

digest="$(shasum -a 256 "$video_file" | awk '{print $1}')"
object_key="video/sanifu-chat-${digest}.mp4"

aws sts get-caller-identity --region "$region" --query Account --output text >/dev/null
aws cloudformation deploy \
  --region "$region" \
  --stack-name "$stack_name" \
  --template-file "$script_dir/video-stack.yaml" \
  --no-fail-on-empty-changeset

stack_output() {
  aws cloudformation describe-stacks \
    --region "$region" \
    --stack-name "$stack_name" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue | [0]" \
    --output text
}

bucket="$(stack_output BucketName)"
distribution_id="$(stack_output DistributionId)"
domain="$(stack_output DistributionDomain)"

aws s3 cp "$video_file" "s3://$bucket/$object_key" \
  --region "$region" \
  --content-type video/mp4 \
  --cache-control 'public, max-age=31536000, immutable' \
  --only-show-errors

remote_size="$(aws s3api head-object --region "$region" --bucket "$bucket" --key "$object_key" --query ContentLength --output text)"
local_size="$(wc -c < "$video_file" | tr -d ' ')"
if [[ "$remote_size" != "$local_size" ]]; then
  echo "S3 object size differs from the downloaded video." >&2
  exit 1
fi

aws cloudfront wait distribution-deployed --id "$distribution_id"
video_url="https://$domain/$object_key"
curl --fail --head --retry 5 --retry-delay 5 "$video_url" >/dev/null
echo "Video URL: $video_url"
echo "SHA-256: $digest"
