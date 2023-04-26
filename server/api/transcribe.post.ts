import axios from 'axios';

const API_BASE_URL = 'https://api.assemblyai.com/v2';
const API_KEY = process.env.ASSEMBLYAI_API_KEY;

export default defineEventHandler(async (event: any) => {
    console.log('event', event);
    const { audioUrl } = JSON.parse(await readBody(event));
    try {
      const response = await axios.post(
        `${API_BASE_URL}/transcript`,
        { audio_url: audioUrl, speaker_labels: true },
        {
          headers: {
            'authorization': API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );
      const responseData = await response.data;
      return { status: 200, body: responseData };
    } catch (error) {
      return { status: 500, body: { message: 'Error transcribing file' } };
    }
  }
);
