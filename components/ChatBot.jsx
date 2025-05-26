import Script from "next/script";
import { useEffect } from "react";

export default function ChatBot() {
  useEffect(() => {
    const init = () => {
      if (window.botpress) {
        window.botpress.init({
          botId: "ea003ff0-32bb-432d-9fdd-84ec32aae515",
          clientId: "ea003ff0-32bb-432d-9fdd-84ec32aae515",
          hostUrl: "https://cdn.botpress.cloud/webchat/v1",
          messagingUrl: "https://messaging.botpress.cloud",
          botName: "Assistant OI",
          selector: "#webchat",
          composerPlaceholder: "Pose-moi une question ou demande un tuto !",
          botConversationDescription: "Je peux t'aider à utiliser le CRM, créer des biens, gérer tes clients, etc.",
          stylesheet: "https://cdn.botpress.cloud/webchat/v1/themes/default.css",
          theme: "light",
          showPoweredBy: false,
          enableConversationDeletion: false
        });

        window.botpress.on("webchat:ready", () => {
          window.botpress.open();
        });
      } else {
        setTimeout(init, 300);
      }
    };

    init();
  }, []);

  return (
    <>
      <Script src="https://cdn.botpress.cloud/webchat/v1/inject.js" strategy="afterInteractive" />
      <div
        id="webchat"
        style={{
          width: "360px",
          height: "500px",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      ></div>
    </>
  );
}
