import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import * as process from "node:process";

export const parallelism = async (
  cb: (position: number, count: number) => void,
  multiplier: number = 1,
  cpus: number = availableParallelism() * multiplier,
) => {
  if (cluster.isPrimary) {
    console.log("CPUS", cpus);

    // Function to count active and inactive workers
    const counts = () => {
      const workers = cluster.workers || {};
      const active = Object.values(workers).filter((worker) =>
        worker?.isConnected(),
      ).length;
      const inactive = Object.values(workers).filter(
        (worker) => !worker?.isConnected(),
      ).length;

      return {
        active,
        inactive,
        total: active + inactive,
      };
    };

    // Function to fork a new worker
    const fork = (index: number) => {
      const worker = cluster.fork({ INDEX: index });
      worker.on("online", () => {
        console.log(`Worker ${worker.process.pid} online`, counts());
      });
    };

    // Fork the initial set of workers
    for (let i = 0; i < cpus; i++) fork(i);

    // Handle messages from workers
    cluster.on("message", (worker, message) => {
      if (message === "DONE") {
        console.log(`Worker ${worker.process.pid} done`, counts());
      }
    });

    // Handle worker exit and restart if necessary
    cluster.on("exit", (worker, code) => {
      console.log(
        `Worker ${worker.process.pid} exited with code ${code}`,
        counts(),
      );
      if (code !== 0 && !worker.exitedAfterDisconnect) {
        console.log(`Worker ${worker.process.pid} died, restarting...`);
        fork(+(process.env.INDEX || 0));
      }
    });
  } else {
    // Worker process
    try {
      const index = +(process.env.INDEX || 0);

      await cb(index, cpus);
    } catch (error: any) {
      console.error(`Worker error:`, error.message);
    }
    process.send?.("DONE");
    process.exit(0);
  }
};
