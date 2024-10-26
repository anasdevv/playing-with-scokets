// it will collect perfromance data and send it to socket.io server
// data we need
const os = require('os');
const io = require('socket.io-client');
const socket = io('http://127.0.0.1:6969');

socket.on('connect', () => {
  console.log('i connected to socket server');
  //   we need a way to identify this machine to whomever is concerned
  //   lets do MAC's
  const networkInterfaces = os.networkInterfaces();
  let macAddr;
  //   ignore the internal i.e. lo
  for (let key in networkInterfaces) {
    if (!networkInterfaces[key][0].internal) {
      macAddr = networkInterfaces[key][0].mac;
      break;
    }
  }

  //   client auth with single key value
  socket.emit('clientAuth', '12jsajdajdsa213');

  perfromanceData().then((d) => {
    console.log('dat', d);
    d.macAddr = macAddr;
    socket.emit('initPerfData', d);
  });

  let performanceDataInterval = setInterval(() => {
    perfromanceData().then((d) => {
      console.log('dat', d);
      socket.emit('perfData', d);
    });
  }, 1000);
  socket.on('disconnect', () => {
    clearInterval(performanceDataInterval);
  });
});
async function perfromanceData() {
  const cpus = os.cpus();
  const osType = os.type() === 'Darwin' ? 'Mac' : os.type();
  const upTime = os.uptime();
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const usedMem = totalMem - freeMem;
  const memUseage = Math.floor((usedMem / totalMem) * 100) / 100;
  // CPU info
  const cpuModel = cpus[0].model;
  const cpuSpeed = cpus[0].speed;
  const numCores = cpus.length;
  const cpuLoad = await getCpuLoad();
  return {
    freeMem,
    totalMem,
    usedMem,
    memUseage,
    osType,
    upTime,
    cpuLoad,
    cpuModel,
    cpuSpeed,
    numCores,
  };
}

const x = cpuAverage();
function cpuAverage() {
  const cpus = os.cpus();
  // get ms in each mode , but this number is since reboot
  // so get it now , and get it in 100ms and compare
  let idleMs = 0;
  let totalMs = 0;
  for (let i = 0; i < cpus.length; i++) {
    for (const type in cpus[i].times) {
      totalMs += cpus[i].times[type];
    }
    idleMs += cpus[i].times.idle;
  }

  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
}

// because the times property is time since boot , we will get  now times
// and 100ms from now times , compare them that will give us current load
function getCpuLoad() {
  return new Promise((resolve) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDiff = end.idle - start.idle;
      const totalDiff = end.total - start.total;
      console.log(idleDiff, totalDiff);
      // calc % of used cpu
      const percentageCpu = 100 - Math.floor((100 * idleDiff) / totalDiff);
      console.log('% ', percentageCpu);
      resolve(percentageCpu);
    }, 100);
  });
}
