export function load(){
  return {
    stages: [
      {duration: "2m", target: 150}, // simulazione di 50 utenti per un breve periodo di tempo (peak hour).
      {duration: "5m", target: 60}, // simulazione dell'aumento di traffico da 1 a 60 utenti in 5 minuti.
      {duration: "10m", target: 60}, // simulazione di 50 utenti per 10 minuti.
      {duration: "3m", target: 100}, // simulazione dell'aumento di traffico a 100 utenti in 3 minuti (peak hour starts).
      {duration: "1m", target: 100}, // simulazione di 100 utenti per un breve periodo di tempo (peak hour).
      {duration: "3m", target: 60}, // simulazione di dimunizione ai 60 utenti in 3 minuti (peak hour ends).
      {duration: "10m", target: 60}, // simulazione di 60 utenti per altri 10 minuti.
      {duration: "5m", target: 0}, // simulazione di dimunizione a 0 utenti.
    ],
    thresholds: {
      http_req_duration: ["avg<300"], // 95% of requests should be below 300ms
      http_req_duration: ["p(99)<1500"], // il 99% delle richieste devo essere completate in meno di 1.5s
    }
  }
}

export function smoke(vus=1, duration="10s"){
  return {
    stages: [{duration: duration, target: 1}], // aumento verso i 400 utenti.
    vus: vus, // utenti virtuali
    thresholds: {
      http_req_blocked: ["min<100", "max > 0"],
      http_req_duration: ["avg<300"], // 95% of requests should be below 300ms
      http_req_waiting: ["max>100"],
      http_req_sending: ["p(90)<500"],
      http_req_receiving: ["med<300", "max > 0"],
      http_req_connecting: ["avg > 0", "max > 0"],
      http_req_tls_handshaking: ["max > 0"],
      group_duration: ["avg<800"],
      iteration_duration: ["min<100", "max>100"],
    }
  }
};

export function soak(){
  return {
    stages: [
      {duration: "10s", target: 20}, // aumento verso i 400 utenti.
      { duration: '3h56m', target: 400 }, // stabile sui 400 utenti per circa 4 ore.
      { duration: '2m', target: 0 }, // riduzione a 0. (opzionale)
    ],
    vus: 3,
    thresholds: {
      http_req_blocked: ["min<100", "max > 0"],
      http_req_duration: ["avg<300"], // 95% of requests should be below 300ms
      http_req_waiting: ["max>100"],
      http_req_sending: ["p(90)<500"],
      http_req_receiving: ["med<300", "max > 0"],
      http_req_connecting: ["avg > 0", "max > 0"],
      http_req_tls_handshaking: ["max > 0"],
      group_duration: ["avg<800"],
      iteration_duration: ["min<100", "max>100"],
    }
  }
};

export function spike(){
  return {
    stages: [
      {duration: "10s", target: 100}, // al di sotto del flusso normale di load
      {duration: "1m", target: 100},
      {duration: "10s", target: 1400}, // spike fino a 1400 utenti
      {duration: "3m", target: 1400}, // continuare a 1400 utenti per 3 minuti
      {duration: "10s", target: 100}, // riduzione. Recovery stage.
      {duration: "3m", target: 100},
      {duration: "10s", target: 0},
    ],
    thresholds: {
      http_req_blocked: ["min<100", "max > 0"],
      http_req_duration: ["avg<900"], // 95% of requests should be below 300ms
      http_req_waiting: ["max>100"],
      http_req_sending: ["p(90)<500"],
      http_req_receiving: ["med<300", "max > 0"],
      http_req_connecting: ["avg > 0", "max > 0"],
      http_req_tls_handshaking: ["max > 0"],
      group_duration: ["avg<2000"],
      iteration_duration: ["min<100", "max>100"],
    }
  }
};

export function stress(vus=1){
  return {
    stages: [
      {duration: "3s", target: 100}, // al di sotto di un normale load
      {duration: "5m", target: 100},
      {duration: "2m", target: 200}, // normale load
      {duration: "5m", target: 200},
      {duration: "2m", target: 300}, // vicino al breaking point
      {duration: "5m", target: 300},
      {duration: "2m", target: 400}, // oltre il breaking point
      {duration: "5m", target: 400},
      {duration: "10m", target: 0}, // riduzione fino a 0. Recovery stage.
    ],
    vus: vus,
    thresholds: {
      http_req_blocked: ["min<100", "max > 0"],
      http_req_duration: ["avg<200"], // 95% of requests should be below 200ms
      http_req_waiting: ["max>100"],
      http_req_sending: ["p(90)<500"],
      http_req_receiving: ["med<300", "max > 0"],
      http_req_connecting: ["avg > 0", "max > 0"],
      http_req_tls_handshaking: ["max > 0"],
      group_duration: ["avg<800"],
      iteration_duration: ["min<100", "max>100"],
    }
  }
};