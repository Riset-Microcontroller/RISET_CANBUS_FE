import mqtt from "mqtt";

// === MQTT Connection Configuration ===
const client = mqtt.connect("ws://localhost:9001", {
  username: "WebMonitor",
  password: "WebMonitor",
});

// === Topic Definitions ===
const TOPIC_VEHICLE = "esp32mqtt/vehicle";
const TOPIC_FE_REQ = "esp32mqtt/handshake/fe/request";
const TOPIC_FE_RES = "esp32mqtt/handshake/fe/response";

// === Data Types ===
export interface VehicleData {
  rpm: number;
  speed: number;
  throttle: number;
  gear: number;
  brake: number;
  maybeOdo: number;
  engineCoolantTemp: number;
  airIntakeTemp: number;
  steeringAngle: number;
  timestamp_sent: number;
}

let latestData: VehicleData;
let isEspOnline = false;
let lastPing = 0;

const latencySamples: number[] = [];
const MAX_SAMPLES = 300;

// === Frontend data callbacks ===
const dataCallbacks: ((data: VehicleData) => void)[] = [];
const connectionCallbacks: ((online: boolean) => void)[] = [];

// === MQTT Connection ===
client.on("connect", () => {
  console.log("📡 MQTT Connected (Frontend)");

  // Subscribe to telemetry and handshake topics
  client.subscribe([TOPIC_VEHICLE, TOPIC_FE_REQ], (err) => {
    if (err) console.error("❌ Subscription error:", err);
    else console.log(`📡 Subscribed to ${TOPIC_VEHICLE} & ${TOPIC_FE_REQ}`);
  });
});

// === Handle Incoming Messages ===
client.on("message", (topic, message) => {
  const msgStr = message.toString();

  // 🧩 1️⃣ Handle handshake ping from ESP
  if (topic === TOPIC_FE_REQ) {
    try {
      const payload = JSON.parse(msgStr);
      if (payload.status === "ping") {
        // Send ACK
        client.publish(TOPIC_FE_RES, JSON.stringify({ status: "ack" }));
        console.log("📤 Sent ACK to ESP (Frontend)");

        // Update ESP online state
        isEspOnline = true;
        lastPing = Date.now();
        connectionCallbacks.forEach((cb) => cb(isEspOnline));
      }
    } catch (err) {
      console.error("❌ Invalid handshake payload:", err);
    }
    return;
  }

  // 🧩 2️⃣ Handle telemetry data from ESP
  if (topic === TOPIC_VEHICLE) {
    try {
      const data = JSON.parse(msgStr) as VehicleData;

      // 📊 HITUNG LATENCY E2E
      if (data.timestamp_sent) {
        const now = Date.now();
        const latency = now - data.timestamp_sent; // Hasil dalam milidetik (ms)

        // Simpan sampel untuk statistik
        latencySamples.push(latency);
        if (latencySamples.length > MAX_SAMPLES){ 
          saveLatencyToLocalSystem();
          latencySamples.shift()
        };

        // Log ke console untuk melihat pergerakan real-time
        console.log(`⏱️ E2E Latency: ${latency}ms`);
      }

      latestData = { ...latestData, ...data };
      dataCallbacks.forEach((cb) => cb(latestData));
      console.log("📨 Vehicle Data:", latestData);
    } catch (err) {
      console.error("❌ Failed to parse vehicle data:", err);
      console.log("Raw message:", msgStr);
    }
  }
});

// === Handle Connection Errors ===
client.on("error", (err) => {
  console.error("❌ MQTT Connection error:", err);
});

// === 3️⃣ Heartbeat monitor (detect when ESP goes silent) ===
setInterval(() => {
  if (isEspOnline && Date.now() - lastPing > 10000) {
    // No ping for 10 seconds -> mark ESP offline
    isEspOnline = false;
    console.warn("⚠️ ESP connection lost (no heartbeat)");
    connectionCallbacks.forEach((cb) => cb(isEspOnline));
  }
}, 2000);

// === Public API for React components ===
export function getLatestData() {
  return latestData;
}

export function subscribeToData(callback: (data: VehicleData) => void) {
  dataCallbacks.push(callback);
  return () => {
    const idx = dataCallbacks.indexOf(callback);
    if (idx > -1) dataCallbacks.splice(idx, 1);
  };
}

// Subscribe to ESP online/offline status
export function subscribeToConnection(callback: (online: boolean) => void) {
  connectionCallbacks.push(callback);
  return () => {
    const idx = connectionCallbacks.indexOf(callback);
    if (idx > -1) connectionCallbacks.splice(idx, 1);
  };
}


export function getLatencyStats() {
  if (latencySamples.length === 0) return null;

  const min = Math.min(...latencySamples);
  const max = Math.max(...latencySamples);
  const avg = latencySamples.reduce((a, b) => a + b) / latencySamples.length;

  return {
    samples: latencySamples.length,
    min: min.toFixed(3),
    max: max.toFixed(3),
    avg: avg.toFixed(3),
  };
}

// Fungsi bantu untuk download CSV hasil rekaman
export function downloadLatencyCSV() {
  const csvContent =
    "data:text/csv;charset=utf-8,Latency_ms\n" + latencySamples.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `latency_report_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
}

// Variabel untuk menyimpan handle file agar tidak perlu minta izin berulang kali
let fileHandle: any = null;

export async function saveLatencyToLocalSystem() {
  if (latencySamples.length === 0) return;

  try {
    // 1. Minta izin akses file jika belum ada (Hanya muncul sekali)
    if (!fileHandle) {
      fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: `latency_report_${Date.now()}.csv`,
        types: [{
          description: 'CSV File',
          accept: { 'text/csv': ['.csv'] },
        }],
      });
    }

    // 2. Buat konten CSV
    const csvContent = "Timestamp,Latency_ms\n" + 
      latencySamples.map((val) => `${new Date().toISOString()},${val}`).join("\n");

    // 3. Tulis data ke file di sistem lokal
    const writable = await fileHandle.createWritable();
    await writable.write(csvContent);
    await writable.close();

    console.log("✅ File Latensi berhasil diperbarui di sistem lokal.");
  } catch (err) {
    console.error("❌ Gagal menyimpan ke sistem: ", err);
  }
}