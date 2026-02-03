import {execSync} from 'child_process'
import { config } from 'dotenv';
config();

// Start dependencies containers
execSync(`docker compose -f ${process.cwd()}/deps/docker-compose.yml up -d`, {stdio: 'inherit'});

console.log(process.env)

// Create default buckets in MinIO
execSync(
  `docker exec minio mc alias set localminio http://localhost:9000 ${process.env.MINIO_ROOT_USER} ${process.env.MINIO_ROOT_PASSWORD}`,
  { stdio: 'inherit' },
);
execSync(
  `docker exec minio mc mb localminio/${process.env.MINIO_BUCKET_NAME}`,
  { stdio: 'inherit' },
);
execSync(
  `docker exec minio mc policy set public localminio/${process.env.MINIO_BUCKET_NAME}`,
  { stdio: 'inherit' },
);