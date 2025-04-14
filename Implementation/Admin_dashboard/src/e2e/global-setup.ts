import { fork, ChildProcess } from "child_process";

let backendProcess: ChildProcess
let gatewayProcess: ChildProcess

export default async function globalSetup() {

  console.log('🚀 Starting backend (test mode)...')

  backendProcess = fork(('../MicroserviceBackend/AuthenticationService/dist/index.js'), [], {
    env: {
      ...process.env,
      DATABASE_URL: 'postgresql://user:password@localhost:5432/mydatabase',
    },
    stdio: 'inherit',
  });

  gatewayProcess = fork(('../MicroserviceBackend/APIGateway/dist/index.js'), [], {
    env: {
      ...process.env,
    },
    stdio: 'inherit',
  });

  // Optionally wait for the server to boot
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Clean up backend on exit
  process.on('exit', () => {
    console.log('🧼 Shutting down backend...');
    backendProcess.kill();
    gatewayProcess.kill();
  })
}
