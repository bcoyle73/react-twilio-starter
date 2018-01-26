const sync = (state = {
  workers: []
  // workers_available: 0
}, action) => {
  switch (action.type) {
    case 'WORKERS_INITIALIZED':
      return Object.assign({}, state, {
        workers: filterWorkers(action.workers)
      });
    case 'WORKER_REMOVED':
      return Object.assign({}, state, {
        workers: removeWorker(state.workers, action.workerUpdate)
      });
    case 'WORKER_ADDED':
      return Object.assign({}, state, {
        workers: addWorker(state.workers, action.workerUpdate)
      });
    default:
      return state;
  }
}

function removeWorker(workers, workerUpdate) {
  return makeWorkerAvailabile(workers, workerUpdate, false)
}

function makeWorkerAvailabile(workers, workerUpdate, available) {
  let newWorkers = workers;

  newWorkers.map((worker) => {
     if(worker.sid == workerUpdate.sid){
       worker.available = available;
       worker.activity = workerUpdate.activity;
     }
   });

  return newWorkers
}

function addWorker(workers, workerUpdate) {
  return makeWorkerAvailabile(workers, workerUpdate, true)
}

function filterWorkers(workers) {
  let newWorkers = [];
  for(let i=0; i<workers.length; i++) {
    let workerObject = { sid: workers[i].sid, activity: workers[i].activityName, available: workers[i].available  }
    newWorkers.push(workerObject)
  }
  return newWorkers
}

export default sync;
