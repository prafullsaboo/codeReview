
import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

const jsonFilePath = path.join(process.cwd(), 'src/pages/api/employees.ts');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      // Read the updated data from the request body
      const updatedData = req.body;

      // Write the updated data to the JSON file
      await fs.writeFile(jsonFilePath, JSON.stringify(updatedData, null, 2), 'utf8');

      // Send a success response
      res.status(200).json({ message: 'Data updated successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Error writing to file' });
    }
  } else {
    // If the request is not PUT, send a method not allowed error
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
