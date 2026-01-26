// fault-tolerance.js

class Queue {
    constructor() {
      this.jobs = [];
    }
  
    push(job) {
      this.jobs.push(job);
    }
  
    pop() {
      return this.jobs.shift();
    }
  
    isEmpty() {
      return this.jobs.length === 0;
    }
  }
  
  // Fake task: 50% fail
  function processJob(job) {
    return Math.random() > 0.5;
  }
  
  const queue = new Queue();
  const MAX_RETRY = 3;
  
  // Producer
  queue.push({ id: 1, retry: 0 });
  queue.push({ id: 2, retry: 0 });
  queue.push({ id: 3, retry: 0 });
  
  // Worker
  function worker() {
    if (queue.isEmpty()) {
      console.log("Queue empty. Done.");
      return;
    }
  
    const job = queue.pop();
    console.log(`Processing job ${job.id}, retry ${job.retry}`);
  
    const success = processJob(job);
  
    if (success) {
      console.log(`✅ Job ${job.id} success\n`);
    } else {
      job.retry++;
      if (job.retry <= MAX_RETRY) {
        console.log(`❌ Job ${job.id} failed → retry\n`);
        queue.push(job);
      } else {
        console.log(`☠️ Job ${job.id} moved to dead-letter\n`);
      }
    }
  
    setTimeout(worker, 500);
  }
  
  worker();
  