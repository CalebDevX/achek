// admin/Newsletter.tsx
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

// import ReactQuill from "react-quill";


import { useRef } from "react";

const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["blockquote", "code-block"],
      ["clean"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
    ],
    handlers: {}, // Will be set in useEffect
  },
};

interface Subscriber {
  id: number;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function Newsletter() {
  const quillRef = useRef<any>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [schedule, setSchedule] = useState("");

  useEffect(() => {
    fetchSubscribers();
    // Set custom image handler for ReactQuill
    if (quillRef.current && quillRef.current.getEditor) {
      const editor = quillRef.current.getEditor();
      editor.getModule("toolbar").addHandler("image", async () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.onchange = async () => {
          if (!input.files || !input.files[0]) return;
          const formData = new FormData();
          formData.append("image", input.files[0]);
          try {
            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (data.url) {
              const range = editor.getSelection();
              editor.insertEmbed(range ? range.index : 0, "image", data.url);
            }
          } catch (err) {
            alert("Image upload failed");
          }
        };
      });
    }
  }, []);

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/newsletter", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      } else {
        const err = await response.json();
        alert("Failed to fetch subscribers: " + (err.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      alert("Failed to fetch subscribers: " + (error.message || error));
    }
  };

  const sendNewsletter = async () => {
    if (!subject || !content) {
      alert("Please fill in both subject and content");
      return;
    }
    if (selected.length === 0) {
      alert("Please select at least one subscriber");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          content: logoUrl ? `<img src='${logoUrl}' alt='Logo' style='max-width:120px;display:block;margin-bottom:16px;'/>` + content : content,
          recipients: selected,
          schedule: schedule || undefined,
        }),
      });
      if (response.ok) {
        alert("Newsletter scheduled!");
        setSubject("");
        setContent("");
        setSelected([]);
        setLogoUrl("");
        setSchedule("");
      } else {
        const err = await response.json();
        alert("Failed to send newsletter: " + (err.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to send newsletter:", error);
      alert("Failed to send newsletter: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Newsletter Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Send Newsletter */}
        <Card>
          <CardHeader>
            <CardTitle>Send Newsletter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Newsletter subject..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo/Image URL (optional)</label>
              <Input
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="Paste logo or ad image URL here"
              />
              <span className="text-xs text-gray-500">Embed your logo, ad, or affiliate image at the top of the newsletter.</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <div className="mb-4">
                <Textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter newsletter content..."
                  className="min-h-[200px]"
                />
                <span className="text-xs text-gray-500">You can add links, images (upload or paste), and embed YouTube videos (paste a YouTube link or use the video button).</span>
                <span className="text-xs text-gray-500">You can add links, images (upload or paste), and embed YouTube videos (paste a YouTube link or use the video button).</span>
                <span className="text-xs text-gray-500">You can add links, images, and rich formatting for affiliate/ads.</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Schedule Send (optional)</label>
              <Input
                type="datetime-local"
                value={schedule}
                onChange={e => setSchedule(e.target.value)}
              />
              <span className="text-xs text-gray-500">Pick a date and time to schedule the newsletter (leave blank to send now).</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Select Subscribers</label>
              <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                {subscribers.length === 0 ? (
                  <p className="text-gray-500">No subscribers yet</p>
                ) : (
                  subscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={selected.includes(subscriber.email)}
                        onChange={e => {
                          if (e.target.checked) setSelected([...selected, subscriber.email]);
                          else setSelected(selected.filter(email => email !== subscriber.email));
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{subscriber.email}</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${subscriber.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{subscriber.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <Button 
              onClick={sendNewsletter} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (schedule ? "Scheduling..." : "Sending...") : schedule ? `Schedule for ${schedule}` : `Send to ${selected.length} selected`}
            </Button>
          </CardContent>
        </Card>
        {/* Subscribers List */}
        <Card>
          <CardHeader>
            <CardTitle>Subscribers ({subscribers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {subscribers.length === 0 ? (
                <p className="text-gray-500">No subscribers yet</p>
              ) : (
                subscribers.map((subscriber) => (
                  <div
                    key={subscriber.id}
                    className="flex items-center justify-between p-2 border rounded bg-white"
                  >
                    <div>
                      <p className="text-sm font-medium">{subscriber.email}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        subscriber.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subscriber.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
