import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "chat_opened" });
    }
  }, [isOpen]);

  return (
    <div>
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GT-WRCMVPV6" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} /></noscript>
      <script dangerouslySetInnerHTML={{ __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GT-WRCMVPV6');
      `}} />

      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full p-4 shadow-xl bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="text-white w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-full p-4 rounded-2xl shadow-lg border border-gray-200 bg-white">
            <DialogTitle className="text-lg font-semibold">Customer Experience Assistant</DialogTitle>
            <ChatInterface />
          </DialogContent>
        </Dialog>
      </div>

      <div className="my-10 max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-2">Need help selecting the right service?</h3>
        <p className="text-sm text-gray-500 mb-4">Our assistant will walk you through the best-fit options for your business.</p>
        <Button onClick={() => setIsOpen(true)} className="bg-gray-900 text-white">Find Your Best-Fit Solution</Button>
      </div>
    </div>
  );
}

export async function fetchGPTAnswer(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content;
}
