import { useState } from 'react';
import axios from 'axios';

export default function UploadVideo({ userId });
const [video, setVideo] = useState(null);
const [preview, setPreview] = useState('');
const [uploading, setUploading] = useState('false');

const  handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'video/mp4') {
        setVideo(file);
        setPreview(URL.createObjectURL(file));
    } else {
        alert('Only .mp4 files allowed.');
    }
};

const uploadVideo = async () => {
    if (!video) return;
    const formData = new FormData();
    formData.append('video', video);

    setUploading(true);
    try {
        const res = await axios.post('/api/video/upload/${userId}', formData);
        alert('Video uploaded');
    } catch (err) {
        console.error(err);
        alert('Upload failed');
    } finally {
        setUploading(false);
    }
};

return <div className="p-4">
    <h2 className="text-xl font-bold mb-4">Upload Profile Video</h2>
</div>