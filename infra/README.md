# Sanifu chat video delivery

`video-stack.yaml` creates a private S3 bucket and a CloudFront distribution with signed origin access. The bucket blocks public access; its policy permits reads only from this distribution. The stack retains the bucket on deletion so deleting infrastructure cannot silently delete the source asset. The distribution uses its AWS hostname, so no Sanifu DNS record or certificate is required.

The MP4 referenced by the preserved `docs/design/v1/index.html` has **not** been cleared for reuse. Do not download, copy or deploy it. Supply an original Sanifu video or another video with confirmed publishing and rehosting rights. This deployment incurs AWS storage and delivery charges.

After rights, account and region are confirmed, run:

```sh
AWS_REGION=us-west-2 SANIFU_VIDEO_RIGHTS_CONFIRMED=1 ./infra/deploy-video.sh path/to/cleared-video.mp4
```

Choose the actual intended region in place of the example. The script checks the AWS identity and video format, deploys the CloudFormation stack, uploads a SHA-256-named immutable object, verifies its S3 size, waits for CloudFront, and checks the HTTPS response. It prints the URL to place in the public website config. Re-running it is safe: the same source bytes produce the same object key.

Keep the CloudFormation stack and its outputs as the infrastructure record. Do not commit downloaded media, AWS credentials, or CloudFormation state files to this repository.
