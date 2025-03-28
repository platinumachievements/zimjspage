import zim from "https://zimjs.org/cdn/017/zim";

// Card configuration with proper dimensions
const CARD_CONFIG = {
    width: 768,   // Height of the card (portrait)
    height: 1024, // Width of the card (portrait)
    fontSize: 100, // Larger font size
    imageSize: 400 // Size for the placeholder image
}

// Sample card data
const cardColors = ["red", "blue", "green", "purple", "orange", "yellow", "pink", "cyan"]
const cardTexts = ["Warrior", "Mage", "Archer", "Dragon", "Knight", "Wizard", "Rogue", "Paladin"]

let frame;
let stage;
let cardImage; // Store the preloaded image

// Initialize the frame with proper dimensions
new Frame(FIT, CARD_CONFIG.width, CARD_CONFIG.height, light, dark, ready, null, null, null, false, false, false, false, false, false, "cardCanvas");

function ready() {
    frame = F;
    stage = S;
    
    // Use the specific static image URL
    const imageUrl = "https://fastly.picsum.photos/id/39/400/400.jpg?hmac=ZYmwkba5ujMadu06Gah8gMOIgTDSlBgHE0bGEqMfJTQ";
    const assets = {
        id: "cardImage",
        src: imageUrl,
        noCORSonImage: true
    };
    
    // Create a test Pic to ensure image is loaded
    const testPic = new Pic(imageUrl);
    testPic.on("complete", () => {
        cardImage = imageUrl;
        generateCards();
    });
}

async function generateCard(color, text) {
    // Clear the stage
    stage.removeAllChildren();
    
    // Create full-size card background with DUO parameters
    new Rectangle({
        width: CARD_CONFIG.width,
        height: CARD_CONFIG.height,
        color: color,
        corner: 20
    }).addTo(stage);
    
    // Create a placeholder for the image using Rectangle
    const imageRect = new Rectangle({
        width: CARD_CONFIG.imageSize,
        height: CARD_CONFIG.imageSize,
        color: "white",
        corner: 10,
        borderColor: "#000",
        borderWidth: 2
    });
    imageRect.x = (CARD_CONFIG.width - CARD_CONFIG.imageSize) / 2;
    imageRect.y = 100;
    imageRect.addTo(stage);
    
    // Add the image using Pic container with URL directly
    const pic = new Pic(cardImage, CARD_CONFIG.imageSize - 20, CARD_CONFIG.imageSize - 20);
    pic.x = imageRect.x - 5; // Align with rectangle's border
    pic.y = imageRect.y - 5; // Align with rectangle's border
    pic.addTo(stage);
    
    // Add large label with DUO parameters
    const label = new Label({
        text: text,
        size: CARD_CONFIG.fontSize,
        color: "#000",
        bold: true,
        align: "center",
        valign: "middle",
        backgroundColor: "white",
        backgroundBorderColor: "#000",
        backgroundBorderWidth: 2,
        corner: 10,
        padding: 20
    });
    label.x = CARD_CONFIG.width / 2;
    label.y = CARD_CONFIG.height - 150; // Position from bottom
    label.addTo(stage);
    
    // Update the stage
    stage.update();
    
    // Convert to image
    return stage.canvas.toDataURL("image/png");
}

// Make generateCards available globally
window.generateCards = function() {
    const cardGrid = document.getElementById("cardGrid");
    cardGrid.innerHTML = ""; // Clear existing cards
    
    // Disable button during generation
    const button = document.querySelector('button');
    button.disabled = true;
    button.style.opacity = '0.7';
    
    // Generate cards one at a time with delay
    let cardCount = 0;
    const totalCards = 500;
    const delay = 50; // 50ms delay between cards
    
    async function addNextCard() {
        if (cardCount >= totalCards) {
            button.disabled = false;
            button.style.opacity = '1';
            return;
        }
        
        const color = cardColors[rand(cardColors.length - 1)];
        const text = cardTexts[rand(cardTexts.length - 1)];
        const cardImage = await generateCard(color, text);
        
        const img = document.createElement("img");
        img.src = cardImage;
        img.className = "card-image";
        cardGrid.appendChild(img);
        
        // Trigger animation after a brief delay
        setTimeout(() => {
            img.classList.add('visible');
        }, 50);
        
        cardCount++;
        setTimeout(addNextCard, delay);
    }
    
    addNextCard();
} 