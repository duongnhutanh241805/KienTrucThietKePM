const amqp = require('amqplib');
const readline = require('readline');

// Thiết lập nhập liệu từ bàn phím
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function startService1() {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();

    const sendQueue = 'service1_to_service2';
    const receiveQueue = 'service2_to_service1';

    await channel.assertQueue(sendQueue, { durable: false });
    await channel.assertQueue(receiveQueue, { durable: false });

    console.log("--- SERVICE 1 ĐÃ SẴN SÀNG ---");

    // Lắng nghe tin nhắn từ Service 2
    channel.consume(receiveQueue, (msg) => {
        console.log(`\n[Service 2 nói]: ${msg.content.toString()}`);
    }, { noAck: true });

    // Gửi tin nhắn khi người dùng nhập từ bàn phím
    const askMessage = () => {
        rl.question('Nhập tin nhắn gửi Service 2: ', (answer) => {
            channel.sendToQueue(sendQueue, Buffer.from(answer));
            askMessage();
        });
    };
    askMessage();
}

startService1().catch(console.error);