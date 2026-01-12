const amqp = require('amqplib');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function startService2() {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();

    const sendQueue = 'service2_to_service1';
    const receiveQueue = 'service1_to_service2';

    await channel.assertQueue(sendQueue, { durable: false });
    await channel.assertQueue(receiveQueue, { durable: false });

    console.log("--- SERVICE 2 ĐÃ SẴN SÀNG ---");

    // Lắng nghe tin nhắn từ Service 1
    channel.consume(receiveQueue, (msg) => {
        console.log(`\n[Service 1 nói]: ${msg.content.toString()}`);
    }, { noAck: true });

    // Gửi tin nhắn khi người dùng nhập từ bàn phím
    const askMessage = () => {
        rl.question('Nhập tin nhắn gửi Service 1: ', (answer) => {
            channel.sendToQueue(sendQueue, Buffer.from(answer));
            askMessage();
        });
    };
    askMessage();
}

startService2().catch(console.error);