
const cookieName = "syslatech-cookie-consent";

const banner = document.querySelector<HTMLDivElement>(
  "#cookie-banner"
);

const acceptButton = document.querySelector<HTMLButtonElement>(
  "#accept-cookies"
);

const rejectButton = document.querySelector<HTMLButtonElement>(
  "#reject-cookies"
);

const settingsButton = document.querySelector<HTMLButtonElement>(
  "#cookie-settings"
);

// Save the user's choice and close the banner
function closeBanner(choice: "accepted" | "rejected"): void {
  localStorage.setItem(cookieName, choice);

  if (banner) {
    banner.hidden = true;
  }
}

// Run only when all required cookie banner elements exist
if (banner && acceptButton && rejectButton) {
  const savedChoice = localStorage.getItem(cookieName);

  // Show the banner if the user has not made a choice yet
  if (savedChoice !== "accepted" && savedChoice !== "rejected") {
    banner.hidden = false;
  } else {
    banner.hidden = true;
  }

  // Accept all cookies
  acceptButton.addEventListener("click", () => {
    closeBanner("accepted");
  });

  // Reject optional cookies
  rejectButton.addEventListener("click", () => {
    closeBanner("rejected");
  });

  // Reopen the banner through Cookie Settings
  settingsButton?.addEventListener("click", () => {
    banner.hidden = false;
  });
}
