import axios from 'axios';

const chatId = '-4729839702';
const telegramBotToken = '8490316785:AAEL2RncBkblXm4WSnVV12tXgpWmobfYvjM';

async function LogTelegram(message: string) {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${message}`,
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

export { LogTelegram };
