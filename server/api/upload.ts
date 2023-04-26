import axios from 'axios';

const API_BASE_URL = 'https://api.assemblyai.com/v2';
const API_KEY = process.env.API_KEY;

export default async (req: any, res:any) => {
  if (req.method === 'POST') {
    const file = req.body;
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, file, {
        headers: {
          'authorization': API_KEY,
          'Transfer-Encoding': 'chunked',
        },
      });
      const responseData = await response.data;
      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ message: 'Error uploading file' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
