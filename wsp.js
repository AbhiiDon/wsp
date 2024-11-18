(async () => {
  try {
    const chalk = await import("chalk");
    const { makeWASocket } = await import("@whiskeysockets/baileys");
    const qrcode = await import("qrcode-terminal");
    const fs = await import('fs');
    const pino = await import('pino');
    const { green, red, yellow, blue, cyan, magenta, bgRed, bgGreen, bgYellow, bgBlue } = chalk.default; // Add more colors
    const {
      delay,
      useMultiFileAuthState,
      BufferJSON,
      fetchLatestBaileysVersion,
      PHONENUMBER_MCC,
      DisconnectReason,
      makeInMemoryStore,
      jidNormalizedUser,
      Browsers,
      makeCacheableSignalKeyStore
    } = await import("@whiskeysockets/baileys");
    const Pino = await import("pino");
    const NodeCache = await import("node-cache");

    console.log(blue(`

 $$$$$$\  $$$$$$$\  $$\   $$\ $$$$$$\       $$$$$$$\  $$$$$$$\   $$$$$$\  $$\   $$\ $$$$$$$\  
$$  __$$\ $$  __$$\ $$ |  $$ |\_$$  _|      $$  __$$\ $$  __$$\ $$  __$$\ $$$\  $$ |$$  __$$\ 
$$ /  $$ |$$ |  $$ |$$ |  $$ |  $$ |        $$ |  $$ |$$ |  $$ |$$ /  $$ |$$$$\ $$ |$$ |  $$ |
$$$$$$$$ |$$$$$$$\ |$$$$$$$$ |  $$ |        $$$$$$$\ |$$$$$$$  |$$$$$$$$ |$$ $$\$$ |$$ |  $$ |
$$  __$$ |$$  __$$\ $$  __$$ |  $$ |        $$  __$$\ $$  __$$< $$  __$$ |$$ \$$$$ |$$ |  $$ |
$$ |  $$ |$$ |  $$ |$$ |  $$ |  $$ |        $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |\$$$ |$$ |  $$ |
$$ |  $$ |$$$$$$$  |$$ |  $$ |$$$$$$\       $$$$$$$  |$$ |  $$ |$$ |  $$ |$$ | \$$ |$$$$$$$  |
\__|  \__|\_______/ \__|  \__|\______|      \_______/ \__|  \__|\__|  \__|\__|  \__|\_______/ 
   
    `)); 
    
console.log(blue(`

======================================================================                                                              
OWNER :- ABHI BR9ND
WHTSAPP +9779844298980
======================================================================                                                             

    `));

    const phoneNumber = "+91***********";
    const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code");
    const useMobile = process.argv.includes("--mobile");

    const rl = (await import("readline")).createInterface({ input: process.stdin, output: process.stdout });
    const question = (text) => new Promise((resolve) => rl.question(text, resolve));

    // Create a function to cycle through colors for fancy output
    const fancyColors = [green, red, yellow, blue, cyan, magenta, bgRed, bgGreen, bgYellow, bgBlue];
    const getColor = (index) => fancyColors[index % fancyColors.length];

    async function qr() {
      let { version, isLatest } = await fetchLatestBaileysVersion();
      const { state, saveCreds } = await useMultiFileAuthState(`./Aession`);
      const msgRetryCounterCache = new (await NodeCache).default();

      const MznKing = makeWASocket({
        logger: (await pino).default({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        mobile: useMobile,
        browser: Browsers.macOS("Safari"),
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, (await Pino).default({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
          let jid = jidNormalizedUser(key.remoteJid);
          let msg = await store.loadMessage(jid, key.id);
          return msg?.message || "";
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
      });

      if (pairingCode && !MznKing.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api');

        let phoneNumber;
        if (!!phoneNumber) {
          phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

          // Safe check before calling Object.keys
          if (PHONENUMBER_MCC && !Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.default.bgBlack(chalk.default.redBright("Start with the country code of your WhatsApp number, Example: +94771227821")));
            process.exit(0);
          }
        } else {
          console.log(yellow("==============================="));
          phoneNumber = await question(chalk.default.bgBlack(chalk.default.greenBright(`91+ PHONE NUMBER : `)));
          phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

          // Safe check before calling Object.keys
          if (PHONENUMBER_MCC && !Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.default.bgBlack(chalk.default.redBright("91 PHONE NUMBER : ")));
            phoneNumber = await question(chalk.default.bgBlack(chalk.default.greenBright(`Please Enter Valid Number... !! Like 91******** : `)));
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
            rl.close();
          }
        }

        setTimeout(async () => {
          let code = await MznKing.requestPairingCode(phoneNumber);
          code = code?.match(/.{1,4}/g)?.join("-") || code;
          console.log(yellow("==================================="));
          console.log(chalk.default.black(chalk.default.bgGreen(`THIS IS YOUR LOGIN CODE : `)), chalk.default.black(chalk.default.cyan(code)));
        }, 3000);
      }

      MznKing.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;
        if (connection == "open") {
          console.log(yellow(" SUCCESSFULLY LOGIN"));

          // Group list ka option login ke baad
          const showGroupList = await question(cyan("Show group list? (YES/NO): ")).then(res => res.trim().toUpperCase() === "YES");

          if (showGroupList) {
            // Show all groups the user is part of
            const groups = await MznKing.groupFetchAllParticipating();
            console.log(magenta("Your Groups:"));
            Object.keys(groups).forEach((jid, i) => {
              // Display group name and ID (UID)
              console.log(`[${i + 1}] Name: ${groups[jid].subject} - Group ID (UID): ${jid}`);
            });
          }

          // Prompt for number of targets
          const runCount = parseInt(await question(blue("Enter how many targets you want to run on: ")));
          const targets = [];

          // Collect target numbers
          for (let i = 0; i < runCount; i++) {
            const targetNumber = await question(yellow(`Enter target number ${i + 1}: `));
            targets.push(targetNumber);
          }

          // Prompt for name to be appended in each message
          const userName = await question(cyan("hetter name :): "));
          const messageFilePath = await question(chalk.default.bgBlack(chalk.default.greenBright(`ENTER THE MESSAGE FILE PATH: `)));
          const messages = fs.readFileSync(messageFilePath, 'utf-8').split('\n');




// Ask for the message file path
          
          const delaySeconds = await question(green(`ENTER YOUR DELAY (SECONDS): `));

          // Infinite message sending to multiple targets
          const sendMessageInfinite = async () => {
    while (true) {
        for (const targetNumber of targets) {
            for (let i = 0; i < messages.length; i++) {
                try {
                    let message = messages[i];
                    message = userName + " " + message; // Prepend the user name at the start of each message
                    const color = getColor(i); // Cycle through the colors
                    await MznKing.sendMessage(targetNumber, { text: message });
                    console.log(color(`Message sent to ${targetNumber}: ${message}`));

                    // Delay between messages
                    await delay(delaySeconds * 1000);
                } catch (err) {
                    console.error(red(`Failed to send message to ${targetNumber}: ${err}`));
                }
            }
        }
    }
};
sendMessageInfinite();
        }
        if (
          connection === "close" &&
          lastDisconnect &&
          lastDisconnect.error &&
          lastDisconnect.error.output.statusCode != 401
        ) {
          qr();
        }
      });

      MznKing.ev.on('creds.update', saveCreds);
      MznKing.ev.on("messages.upsert", () => { });
    }

    qr();

    process.on('uncaughtException', function (err) {
      let e = String(err);
      if (e.includes("Socket connection timeout")) return;
      if (e.includes("rate-overlimit")) return;
      if (e.includes("Connection Closed")) return;
      if (e.includes("Timed Out")) return;
      if (e.includes("Value not found")) return;
      console.log('Caught exception: ', err);
    });

  } catch (error) {
    console.error("Error importing modules:", error);
  }
})();
