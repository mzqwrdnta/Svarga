let isBotTyping = false;
let conversationContext = {
    lastQuestion: null,
    userPreferences: {
        favoriteFlavor: null,
        spiceLevel: 'medium',
        lastOrder: null,
        phoneNumber: null
    },
    orderInProgress: null,
    orderHistory: []
};

const whatsappBusinessNumber = "6285213963005"; 

function toggleChatbot() {
    const chatbotPopup = document.getElementById('chatbotPopup');
    if (chatbotPopup.style.display === 'flex' || chatbotPopup.style.display === 'block') {
        chatbotPopup.style.display = 'none';
    } else {
        chatbotPopup.style.display = 'flex';
        scrollToBottom();

        setTimeout(() => {
            document.getElementById('userInput').focus();
        }, 300);

        const chatbotMessages = document.getElementById('chatbotMessages');
        if (chatbotMessages.children.length === 0) {
            setTimeout(() => {
                addBotMessage({
                    text: "Halo! Saya SvargaBot 🤖<br>Siap membantu Anda memesan dimsum lezat!<br><br>Ada yang bisa saya bantu?",
                    quickReplies: [
                        "Lihat menu",
                        "Promo hari ini",
                        "Cara pemesanan",
                        "Lokasi toko"
                    ]
                });
            }, 500);
        }
    }
}


function scrollToBottom() {
    const chatbotMessages = document.getElementById('chatbotMessages');
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}


function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message !== '' && !isBotTyping) {
        addUserMessage(message);
        userInput.value = '';
        
        showTypingIndicator();
        
        setTimeout(() => {
            try {
                const botResponse = generateBotResponse(message);
                addBotMessage(botResponse);
            } catch (error) {
                console.error("Error generating response:", error);
                addBotMessage({
                    text: "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung di WhatsApp: <a href='https://wa.me/" + whatsappBusinessNumber + "' target='_blank'>Klik di sini</a>",
                    quickReplies: ["Coba lagi", "Hubungi CS"]
                });
            } finally {
                isBotTyping = false;
            }
        }, 800 + Math.random() * 800);
    }
}


function sendQuickQuestion(button) {
    if (isBotTyping) return;
    
    const question = button.textContent;
    addUserMessage(question);
    
    showTypingIndicator();
    
    setTimeout(() => {
        try {
            const botResponse = generateBotResponse(question);
            addBotMessage(botResponse);
        } catch (error) {
            console.error("Error generating response:", error);
            addBotMessage({
                text: "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung di WhatsApp: <a href='https://wa.me/" + whatsappBusinessNumber + "' target='_blank'>Klik di sini</a>",
                quickReplies: ["Coba lagi", "Hubungi CS"]
            });
        } finally {
            isBotTyping = false;
        }
    }, 600 + Math.random() * 600);
}


function handleKeyPress(e) {
    if (e.key === 'Enter') {
        sendMessage();
        e.preventDefault();
    }
}


function showTypingIndicator() {
    isBotTyping = true;
    const chatbotMessages = document.getElementById('chatbotMessages');
    

    const existingIndicator = document.querySelector('.typing-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message';
    
    const iconImg = document.createElement('img');
    iconImg.src = 'img/bot.jpg';
    iconImg.className = 'bot-icon';
    iconImg.alt = 'Bot Icon';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingContent.appendChild(dot);
    }
    
    typingDiv.appendChild(iconImg);
    typingDiv.appendChild(typingContent);
    chatbotMessages.appendChild(typingDiv);
    
    scrollToBottom();
}


function addUserMessage(message) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message;
    
    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);
    
    updateUserPreferences(message);
    
    scrollToBottom();
}


function updateUserPreferences(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('original') && !conversationContext.userPreferences.favoriteItems?.includes('original')) {
        conversationContext.userPreferences.favoriteFlavor = 'original';
    }
    if (lowerMessage.includes('mentai') && !conversationContext.userPreferences.favoriteItems?.includes('mentai')) {
        conversationContext.userPreferences.favoriteFlavor = 'mentai';
    }
    if (lowerMessage.includes('ayam') || lowerMessage.includes('chicken')) {
        conversationContext.userPreferences.favoriteFlavor = 'ayam';
    }
    if (lowerMessage.includes('ikan') || lowerMessage.includes('fish')) {
        conversationContext.userPreferences.favoriteFlavor = 'ikan';
    }
    if (lowerMessage.includes('pedas')) {
        conversationContext.userPreferences.favoriteFlavor = 'pedas';
    }
    

    if (lowerMessage.match(/pedas\s+sedang|level\s+1|standar|biasa/)) {
        conversationContext.userPreferences.spiceLevel = 'medium';
    } else if (lowerMessage.match(/extra\s+pedas|level\s+2|pedas\s+banget/)) {
        conversationContext.userPreferences.spiceLevel = 'high';
    } else if (lowerMessage.match(/super\s+pedas|level\s+3|pedas\s+gila/)) {
        conversationContext.userPreferences.spiceLevel = 'extreme';
    }
    

    const phoneMatch = message.match(/(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/);
    if (phoneMatch) {
        conversationContext.userPreferences.phoneNumber = phoneMatch[0];
    }
}


function addBotMessage(message) {
    const chatbotMessages = document.getElementById('chatbotMessages');

    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.parentElement.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';

    const iconImg = document.createElement('img');
    iconImg.src = 'img/bot.jpg';
    iconImg.className = 'bot-icon';
    iconImg.alt = 'Bot Icon';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (typeof message === 'object' && message !== null && 'text' in message) {
        contentDiv.innerHTML = message.text;

        if (message.isQuestion) {
            conversationContext.lastQuestion = message.contextKey;
        }

        if (Array.isArray(message.quickReplies)) {
            const quickRepliesDiv = document.createElement('div');
            quickRepliesDiv.className = 'quick-questions';

            message.quickReplies.forEach(reply => {
                const button = document.createElement('button');
                button.textContent = reply;
                button.onclick = function() { sendQuickQuestion(this); };
                quickRepliesDiv.appendChild(button);
            });

            contentDiv.appendChild(quickRepliesDiv);
        }
    } else {
        contentDiv.textContent = message;
    }

    messageDiv.appendChild(iconImg);
    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);

    scrollToBottom();
}

function generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (conversationContext.orderInProgress) {
        const orderResponse = handleOrderFollowUp(userMessage);
        if (orderResponse) return orderResponse;
    }
    
    if (conversationContext.lastQuestion) {
        const followUpResponse = handleFollowUp(userMessage);
        if (followUpResponse) return followUpResponse;
    }
    
    if (lowerMessage.includes('dimana') || lowerMessage.includes('lokasi') || 
        lowerMessage.includes('alamat') || lowerMessage.includes('map') ||
        lowerMessage.includes('maps') || lowerMessage.includes('gmaps')) {
        return {
            text: "📍 <b>Lokasi Toko Svarga Dimsum:</b><br>" +
                  "Jl. Raya Abdul Gani No.2 Blok B, Jatimulya, Kec. Cilodong, Kota Depok, Jawa Barat 16413<br><br>" +
                  "📌 <a href='https://maps.google.com/?q=Svarga+Dimsum+Depok' target='_blank' style='color: #4CAF50;'>Buka di Google Maps</a><br>" +
                  "📱 <a href='tel:+085213963005' style='color: #4CAF50;'>Hubungi: (021) 778-899</a><br><br>" +
                  "Kami buka setiap hari:<br>" +
                  "Senin-Jumat: 10.00-21.00<br>" +
                  "Sabtu-Minggu: 09.00-22.00",
            quickReplies: [
                "Area pengiriman",
                "Ada parkiran?",
                "Menu terlaris"
            ],
            isQuestion: true,
            contextKey: 'location_info'
        };
    }
    
    if (lowerMessage.includes('jam buka') || lowerMessage.includes('buka jam') || 
        lowerMessage.includes('tutup jam') || lowerMessage.includes('operasional')) {
        return {
            text: "🕒 <b>Jam Operasional:</b><br>" +
                  "Senin-Jumat: 10.00 - 21.00<br>" +
                  "Sabtu-Minggu: 09.00 - 22.00<br><br>" +
                  "Hari libur tetap buka dengan jam yang mungkin berbeda.<br>" +
                  "Untuk pemesanan terakhir, silakan order 1 jam sebelum tutup.",
            quickReplies: [
                "Lokasi toko",
                "Cara pesan",
                "Menu favorit"
            ],
            isQuestion: true,
            contextKey: 'operational_hours'
        };
    }

    if (lowerMessage.includes('menu') || lowerMessage.includes('pilihan') || 
        lowerMessage.includes('ada apa') || lowerMessage.includes('jual apa')) {
        return {
            text: "🍽️ <b>Menu Andalan Svarga Dimsum:</b><br><br>" +
                  "1. <b>Dimsum Original</b> - Rp25.000 (4 biji)<br>" +
                  "   Kulit lembut dengan isian ayam premium<br><br>" +
                  "2. <b>Dimsum Mentai</b> - Rp30.000 (4 biji)<br>" +
                  "   Dengan saus mentai premium yang lumer<br><br>" +
                  "3. <b>Dumpling Ayam</b> - Rp30.000 (4 biji)<br>" +
                  "   Isian ayam juicy dengan tekstur kenyal<br><br>" +
                  "4. <b>Dumpling Ikan</b> - Rp30.000 (4 biji)<br>" +
                  "   Ikan segar dengan citarasa gurih<br><br>" +
                  "5. <b>Dimsum Pedas</b> - Rp28.000 (4 biji)<br>" +
                  "   Dengan level pedas bisa dipilih (1-3)<br><br>" +
                  "6. <b>Paket Kombo</b> - Rp100.000<br>" +
                  "   Berisi 1 Original, 1 Ayam, 1 Ikan, 1 Mentai<br><br>" +
                  "Mau yang mana? Atau butuh rekomendasi?",
            quickReplies: ["Original", "Mentai", "Ayam", "Ikan", "Pedas", "Kombo", "Rekomendasi"],
            isQuestion: true,
            contextKey: 'menu_selection'
        };
    }
    

    if (lowerMessage.includes('harga') || lowerMessage.includes('berapa') || 
        lowerMessage.includes('harganya') || lowerMessage.match(/rp\s*\d/)) {
        
        if (lowerMessage.includes('original') || lowerMessage.includes('basic')) {
            return {
                text: "💰 <b>Dimsum Original</b><br>" +
                      "Harga: Rp25.000 untuk 4 biji<br>" +
                      "Promo: Beli 3 gratis 1 (total Rp75.000 dapat 16 biji)<br><br>" +
                      "Isi: Ayam premium dengan bumbu rahasia kami",
                quickReplies: ["Pesan Original", "Lihat menu lain", "Rekomendasi"]
            };
        } else if (lowerMessage.includes('mentai')) {
            return {
                text: "💰 <b>Dimsum Mentai</b><br>" +
                      "Harga: Rp30.000 untuk 4 biji<br>" +
                      "Promo: Beli 2 gratis saus mentai ekstra<br><br>" +
                      "Dengan saus mentai premium yang lumer di mulut!",
                quickReplies: ["Pesan Mentai", "Lihat menu lain", "Kombo"]
            };
        } else if (lowerMessage.includes('ayam')) {
            return {
                text: "💰 <b>Dumpling Ayam</b><br>" +
                      "Harga: Rp30.000 untuk 4 biji<br>" +
                      "Promo: Beli 2 gratis 1 sambal spesial<br><br>" +
                      "Isian ayam juicy dengan tekstur kenyal",
                quickReplies: ["Pesan Ayam", "Lihat menu lain", "Kombo"]
            };
        } else if (lowerMessage.includes('ikan')) {
            return {
                text: "💰 <b>Dumpling Ikan</b><br>" +
                      "Harga: Rp30.000 untuk 4 biji<br>" +
                      "Promo: Beli 2 gratis kecap ikan premium<br><br>" +
                      "Ikan segar dengan citarasa gurih",
                quickReplies: ["Pesan Ikan", "Lihat menu lain", "Kombo"]
            };
        } else if (lowerMessage.includes('pedas')) {
            return {
                text: "💰 <b>Dimsum Pedas</b><br>" +
                      "Harga: Rp28.000 untuk 4 biji<br>" +
                      "Promo: Beli 3 gratis level pedas super<br><br>" +
                      "Tersedia 3 level pedas: Standar, Extra, Super",
                quickReplies: ["Pesan Pedas", "Lihat menu lain", "Tanya level pedas"]
            };
        } else if (lowerMessage.includes('kombo')) {
            return {
                text: "💰 <b>Paket Kombo</b><br>" +
                      "Harga: Rp100.000 (hemat Rp20.000)<br>" +
                      "Isi: 1 Original, 1 Ayam, 1 Ikan, 1 Mentai<br><br>" +
                      "Cocok untuk 2-3 orang atau yang mau mencoba berbagai varian",
                quickReplies: ["Pesan Kombo", "Lihat menu lain", "Untuk berapa orang?"]
            };
        } else {
            return {
                text: "💰 <b>Daftar Harga Lengkap:</b><br>" +
                      "1. Dimsum Original - Rp25.000 (4 biji)<br>" +
                      "2. Dimsum Mentai - Rp30.000 (4 biji)<br>" +
                      "3. Dumpling Ayam - Rp30.000 (4 biji)<br>" +
                      "4. Dumpling Ikan - Rp30.000 (4 biji)<br>" +
                      "5. Dimsum Pedas - Rp28.000 (4 biji)<br>" +
                      "6. Paket Kombo - Rp100.000 (hemat Rp20.000)<br><br>" +
                      "💡 <i>Harga belum termasuk ongkos kirim</i><br>" +
                      "🤑 Ada diskon untuk pembelian banyak!",
                quickReplies: [
                    "Lihat menu detail",
                    "Ada promo?",
                    "Rekomendasi"
                ],
                isQuestion: true,
                contextKey: 'price_info'
            };
        }
    }
    

    if (lowerMessage.includes('pesan') || lowerMessage.includes('beli') || 
        lowerMessage.includes('order') || lowerMessage.includes('mau') ||
        lowerMessage.includes('ambil') || lowerMessage.includes('takeaway') ||
        lowerMessage.includes('antar') || lowerMessage.includes('delivery')) {
        return handleOrderInitiation(lowerMessage);
    }
    

    if (lowerMessage.includes('promo') || lowerMessage.includes('diskon') || 
        lowerMessage.includes('murah') || lowerMessage.includes('hemat') ||
        lowerMessage.includes('voucher') || lowerMessage.includes('potongan')) {
        return {
            text: "🎁 <b>Promo & Diskon Terkini:</b><br>" +
                  "1. <b>Diskon 10%</b> untuk pembelian >Rp50.000<br>" +
                  "2. <b>Gratis 1 Dimsum Original</b> beli 2 paket<br>" +
                  "3. <b>Cashback Rp5.000</b> untuk pembayaran via OVO/Gopay<br>" +
                  "4. <b>Paket Keluarga</b> 5 paket hanya Rp120.000<br>" +
                  "5. <b>Member Card</b> dapat poin untuk ditukar hadiah<br><br>" +
                  "📌 <i>Syarat & ketentuan berlaku</i><br>" +
                  "🔄 Promo bisa berubah setiap minggu",
            quickReplies: [
                "Cara dapat promo",
                "Syarat promo",
                "Pesan sekarang",
                "Info member card"
            ],
            isQuestion: true,
            contextKey: 'promo_info'
        };
    }
    

    if (lowerMessage.includes('pengiriman') || lowerMessage.includes('antar') || 
        lowerMessage.includes('delivery') || lowerMessage.includes('kirim') ||
        lowerMessage.includes('ongkir') || lowerMessage.includes('ongkos')) {
        return {
            text: "🚚 <b>Layanan Pengiriman:</b><br>" +
                  "1. <b>Gratis Ongkir</b> untuk order >Rp75.000 di area Depok<br>" +
                  "2. <b>Area Pengiriman:</b><br>" +
                  "   - Depok: Rp10.000<br>" +
                  "   - Jakarta Selatan: Rp15.000<br>" +
                  "   - Jakarta Pusat/Timur: Rp20.000<br>" +
                  "3. <b>Minimal Order:</b> Rp30.000<br>" +
                  "4. <b>Estimasi:</b> 30-45 menit (tergantung lokasi)<br><br>" +
                  "📱 <a href='https://wa.me/" + whatsappBusinessNumber + "?text=Saya%20mau%20tanya%20ongkir' target='_blank' style='color: #4CAF50;'>Tanya ongkir khusus</a>",
            quickReplies: [
                "Cek alamat saya",
                "Lokasi toko",
                "Takeaway",
                "Cara pesan"
            ],
            isQuestion: true,
            contextKey: 'delivery_info'
        };
    }
    

    if (lowerMessage.includes('rekomendasi') || lowerMessage.includes('terbaik') || 
        lowerMessage.includes('enak') || lowerMessage.includes('favorit') ||
        lowerMessage.includes('terlaris') || lowerMessage.includes('best seller')) {
        
        if (conversationContext.userPreferences.favoriteFlavor) {
            const favorite = conversationContext.userPreferences.favoriteFlavor;
            let recommendation = '';
            
            if (favorite === 'mentai') {
                recommendation = "⭐ <b>Rekomendasi Untuk Kamu:</b><br>" +
                                "1. <b>Paket Kombo Mentai</b> - 3 Mentai + 1 Original (Rp85.000)<br>" +
                                "2. <b>Mentai Level Up</b> - Extra saus mentai (Rp35.000)<br>" +
                                "3. <b>Dimsum Crispy Mentai</b> - Versi garing (Rp32.000)";
            } else if (favorite === 'pedas') {
                recommendation = "🌶️ <b>Rekomendasi Pedas:</b><br>" +
                                "1. <b>Dimsum Pedas Level Super</b> - Dijamin nangis! (Rp28.000)<br>" +
                                "2. <b>Paket Pedas Mania</b> - 4 Pedas level 3 (Rp100.000)<br>" +
                                "3. <b>Combo Pedas</b> - 2 Pedas + 2 Original (Rp50.000)";
            } else {
                recommendation = "🍱 <b>Rekomendasi Terbaik:</b><br>" +
                                "1. <b>Paket Variasi</b> - 1 Original, 1 Ayam, 1 Ikan, 1 Mentai (Rp100.000)<br>" +
                                "2. <b>Paket Kenyang</b> - 3 Original + 2 Ayam (Rp120.000)<br>" +
                                "3. <b>Paket Coba-Coba</b> - 2 Original + 1 pilihan (Rp50.000)";
            }
            
            return {
                text: recommendation + "<br><br>Mau pesan salah satu ini atau mau rekomendasi lain?",
                quickReplies: ["Pesan ini", "Lihat menu", "Rekomendasi lain", "Tanya harga"],
                isQuestion: true,
                contextKey: 'personalized_recommendation'
            };
        } else {
            return {
                text: "🏆 <b>Best Seller Svarga Dimsum:</b><br>" +
                      "1. <b>Dimsum Mentai</b> - Favorit 80% pelanggan!<br>" +
                      "   \"Saus mentainya bikin nagih!\" - Dani, Depok<br><br>" +
                      "2. <b>Dumpling Ayam</b> - Juara tekstur!<br>" +
                      "   \"Ayamnya juicy banget!\" - Rina, Jakarta<br><br>" +
                      "3. <b>Paket Kombo</b> - Paling hemat!<br>" +
                      "   \"Cocok buat cicip semua varian\" - Budi, Bekasi<br><br>" +
                      "Mau coba yang mana?",
                quickReplies: ["Mentai", "Ayam", "Kombo", "Lihat menu", "Testimoni lain"],
                isQuestion: true,
                contextKey: 'general_recommendation'
            };
        }
    }
    

    if (lowerMessage.match(/halo|hai|hi|hey|pagi|siang|sore|malam/)) {
        const time = new Date().getHours();
        let greeting = "";
        
        if (time < 11) greeting = "Pagi";
        else if (time < 15) greeting = "Siang";
        else if (time < 18) greeting = "Sore";
        else greeting = "Malam";
        
        const responses = [
            `${greeting}! Mau pesan dimsum apa hari ini? 😊`,
            `${greeting}! Ada yang bisa SvargaBot bantu?`,
            `${greeting}! Siap membantu pesanan dimsum Anda!`,
            `${greeting}! Mau yang original atau mentai nih?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    

    if (lowerMessage.match(/makasih|terima kasih|thanks|thank you|terimakasih/)) {
        const thanksResponses = [
            "Sama-sama! Jangan lupa pesan lagi ya 😉",
            "Terima kasih kembali! Senang bisa membantu.",
            "Dengan senang hati! Sampai jumpa lagi.",
            "Senang bisa membantu! Jangan lupa kasih rating ya ⭐⭐⭐⭐⭐"
        ];
        return thanksResponses[Math.floor(Math.random() * thanksResponses.length)];
    }
    
    if (lowerMessage.match(/kamu siapa|nama kamu|who are you|svargabot/)) {
        return {
            text: "🤖 <b>Tentang SvargaBot:</b><br>" +
                  "Saya asisten virtual Svarga Dimsum yang siap membantu:<br>" +
                  "- Pemesanan dimsum<br>" +
                  "- Informasi menu & promo<br>" +
                  "- Tracking order<br>" +
                  "- Layanan pelanggan<br><br>" +
                  "Saya aktif 24 jam! Butuh bantuan lain?",
            quickReplies: ["Cara pesan", "Menu", "Promo", "Lokasi"]
        };
    }
    

    if (lowerMessage.match(/halah|wkwk|haha|lol|ngakak|gokil/)) {
        return {
            text: "Haha 😄 Ngomong-ngomong, udah cobain dimsum mentai kita belum?<br><br>" +
                  "💬 <i>\"Dijamin bikin ketagihan!\" - 9/10 pelanggan</i>",
            quickReplies: ["Pesan Mentai", "Testimoni lain", "Cari yang lucu lagi"]
        };
    }
    
    if (lowerMessage.match(/lapar|laper|pengen makan|mau makan|perut bunyi/)) {
        return {
            text: "Waduh, jangan sampai kelaparan!<br>" +
                  "Yuk pesan dimsum kita sekarang. Ada yang bisa langsung diantar!<br><br>" +
                  "⏱️ <i>Paling cepat 30 menit sampai</i>",
            quickReplies: ["Pesan sekarang", "Menu cepat saji", "Delivery"]
        };
    }
    
    if (lowerMessage.match(/enak ga|enak nggak|gimana rasanya|bagus ga/)) {
        return {
            text: "🌟 <b>Rating Pelanggan:</b> 4.9/5 dari 1200+ review<br><br>" +
                  "💬 <b>Testimoni:</b><br>" +
                  "\"Enak banget! Mentainya lumer di mulut\" - ⭐⭐⭐⭐⭐<br>" +
                  "\"Ayamnya juicy, kulitnya pas\" - ⭐⭐⭐⭐<br>" +
                  "\"Pedasnya nendang!\" - ⭐⭐⭐⭐⭐<br><br>" +
                  "Mau buktiin sendiri? 😋",
            quickReplies: ["Pesan sekarang", "Lihat menu", "Testimoni lain"]
        };
    }
    
    if (lowerMessage.match(/pedas ga|pedes ga|level pedas|seberapa pedas/)) {
        return {
            text: "🌶️ <b>Level Pedas Svarga Dimsum:</b><br>" +
                  "1. <b>Standar</b> - Pedas ringan, cocok untuk pemula<br>" +
                  "2. <b>Extra</b> - Untuk yang suka pedas (selevel sambal matah)<br>" +
                  "3. <b>Super</b> - Hanya untuk pecinta pedas sejati!<br><br>" +
                  "💡 <i>Bisa request level pedas saat order</i>",
            quickReplies: ["Pesan Pedas", "Level 2", "Level 3", "Tidak pedas"]
        };
    }
    
    if (lowerMessage.match(/bosen|bosan|gabut|iseng|ngobrol/)) {
        return {
            text: "Haha, kalau bosan enak lho nyemil dimsum sambil ngobrol sama saya!<br><br>" +
                  "🤔 <i>Fun Fact:</i> Tahukah kamu?<br>" +
                  "Dimsum artinya \"makanan kecil\" dalam bahasa Kanton!<br><br>" +
                  "Mau pesan sambil belajar fakta unik lainnya? 😄",
            quickReplies: ["Pesan sekarang", "Fakta unik lain", "Menu"]
        };
    }
    

    if (lowerMessage.match(/status pesanan|track order|cek order|pesanan saya/)) {
        if (conversationContext.userPreferences.lastOrder) {
            const lastOrder = conversationContext.userPreferences.lastOrder;
            return {
                text: "📦 <b>Status Pesanan Terakhir:</b><br>" +
                      "Menu: " + (lastOrder.item === 'Kombo' ? 'Paket Kombo' : 'Dimsum '+lastOrder.item) + "<br>" +
                      "Jumlah: " + lastOrder.quantity + " paket<br>" +
                      "Status: Dalam proses<br><br>" +
                      "Untuk update realtime, silakan hubungi WhatsApp kami:<br>" +
                      "<a href='https://wa.me/" + whatsappBusinessNumber + "?text=Saya%20mau%20cek%20status%20pesanan' target='_blank' style='color: #4CAF50;'>Klik untuk chat WA</a>",
                quickReplies: ["Pesan lagi", "Menu", "Hubungi CS"]
            };
        } else {
            return {
                text: "Sepertinya Anda belum memiliki pesanan terakhir.<br>" +
                      "Mau pesan sekarang atau butuh bantuan lain?<br><br>" +
                      "📱 Bisa juga langsung chat via WA:<br>" +
                      "<a href='https://wa.me/" + whatsappBusinessNumber + "' target='_blank' style='color: #4CAF50;'>Klik di sini</a>",
                quickReplies: ["Lihat menu", "Cara pesan", "Promo"]
            };
        }
    }
    

    if (lowerMessage.match(/kontak|whatsapp|wa|telepon|cs|customer service/)) {
        return {
            text: "📞 <b>Hubungi Kami:</b><br>" +
                  "1. WhatsApp: <a href='https://wa.me/" + whatsappBusinessNumber + "' target='_blank' style='color: #4CAF50;'>Klik di sini</a><br>" +
                  "2. Telepon: (021) 778-899<br>" +
                  "3. Email: cs@svargadimsum.com<br>" +
                  "4. Instagram: @svargadimsum<br><br>" +
                  "⏰ <i>Layanan pelanggan aktif 09.00-21.00 WIB</i>",
            quickReplies: ["Pesan via WA", "Lokasi", "Menu"]
        };
    }
    

    if (lowerMessage.match(/pembayaran|bayar|payment|transfer|ovo|gopay|dana/)) {
        return {
            text: "💳 <b>Metode Pembayaran:</b><br>" +
                  "1. <b>Tunai</b> - Saat takeaway/dine-in<br>" +
                  "2. <b>Transfer Bank</b> - BCA, Mandiri, BNI<br>" +
                  "3. <b>E-Wallet</b> - OVO, Gopay, DANA (+cashback 5%)<br>" +
                  "4. <b>QRIS</b> - Scan bayar<br><br>" +
                  "💡 <i>Pembayaran online hanya via WhatsApp order</i>",
            quickReplies: ["Pesan via WA", "Cara order", "Info rekening"]
        };
    }
    

    const defaultResponses = [
        {
            text: "Maaf saya tidak mengerti. Bisa diulang dengan bahasa lain?<br><br>" +
                  "Atau langsung chat CS kami di:<br>" +
                  "<a href='https://wa.me/" + whatsappBusinessNumber + "' target='_blank' style='color: #4CAF50;'>WhatsApp Customer Service</a>",
            quickReplies: ["Lihat menu", "Promo", "Lokasi"]
        },
        {
            text: "Sebagai bot pemesanan dimsum, saya bisa bantu Anda dengan:<br>" +
                  "- Informasi menu & harga<br>" +
                  "- Proses pemesanan<br>" +
                  "- Tracking order<br>" +
                  "- Info promo<br><br>" +
                  "Mau tanya apa?",
            quickReplies: ["Lihat menu", "Cara pesan", "Promo hari ini"]
        }
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}


function handleOrderInitiation(message) {
    let item = '';
    if (message.includes('original')) item = 'Original';
    if (message.includes('mentai')) item = 'Mentai';
    if (message.includes('ayam')) item = 'Ayam';
    if (message.includes('ikan')) item = 'Ikan';
    if (message.includes('pedas')) item = 'Pedas';
    if (message.includes('kombo')) item = 'Kombo';
    
    if (item) {
        conversationContext.orderInProgress = {
            item: item,
            quantity: null,
            notes: '',
            spiceLevel: conversationContext.userPreferences.spiceLevel,
            deliveryMethod: message.includes('antar') || message.includes('delivery') ? 'delivery' : 
                          message.includes('ambil') || message.includes('takeaway') ? 'takeaway' : null
        };
        
        return {
            text: `🍴 Oke, pesan <b>${item === 'Kombo' ? 'Paket Kombo' : 'Dimsum '+item}</b>.<br><br>` +
                  (conversationContext.orderInProgress.deliveryMethod === 'delivery' ? 
                   "Untuk delivery, silakan konfirmasi alamat pengiriman nanti.<br><br>" : "") +
                  "Mau pesan berapa paket?",
            quickReplies: ["1 paket", "2 paket", "3 paket", "4 paket"],
            isQuestion: true,
            contextKey: 'order_quantity'
        };
    } else {
        return {
            text: "Mau pesan yang mana? Kami punya:<br>" +
                  "- Original (Rp25.000)<br>" +
                  "- Mentai (Rp30.000)<br>" +
                  "- Ayam (Rp30.000)<br>" +
                  "- Ikan (Rp30.000)<br>" +
                  "- Pedas (Rp28.000)<br>" +
                  "- Paket Kombo (Rp100.000)<br><br>" +
                  "Atau mau rekomendasi dari saya?",
            quickReplies: ["Original", "Mentai", "Ayam", "Ikan", "Pedas", "Kombo", "Rekomendasi"],
            isQuestion: true,
            contextKey: 'menu_selection'
        };
    }
}

function handleOrderFollowUp(message) {
    const order = conversationContext.orderInProgress;
    if (!order) return null;
    
    const lowerMessage = message.toLowerCase();
    

    if (order.quantity === null) {
        const quantity = parseInt(message.match(/\d+/)?.[0]) || 1;
        order.quantity = Math.min(Math.max(quantity, 1), 10);
        

        if (!order.deliveryMethod) {
            return {
                text: `Oke, ${order.quantity} paket ${order.item === 'Kombo' ? 'Paket Kombo' : 'Dimsum '+order.item}.<br><br>` +
                      "Mau diantar atau takeaway?",
                quickReplies: ["Diantar (Delivery)", "Ambil di tempat (Takeaway)"],
                isQuestion: true,
                contextKey: 'delivery_method'
            };
        } else {
            return {
                text: `Oke, ${order.quantity} paket ${order.item === 'Kombo' ? 'Paket Kombo' : 'Dimsum '+order.item}.<br><br>` +
                      "Ada catatan khusus? (contoh: pedas level 2, sambal extra, tanpa kecap)",
                quickReplies: ["Tidak ada", "Pedas level 2", "Sambal extra", "Tanpa kecap"],
                isQuestion: true,
                contextKey: 'order_notes'
            };
        }
    }
    

    if (!order.deliveryMethod && (lowerMessage.includes('antar') || lowerMessage.includes('delivery') || 
                                 lowerMessage.includes('ambil') || lowerMessage.includes('takeaway'))) {
        order.deliveryMethod = lowerMessage.includes('antar') || lowerMessage.includes('delivery') ? 'delivery' : 'takeaway';
        
        return {
            text: `Oke, ${order.deliveryMethod === 'delivery' ? 'diantar' : 'ambil di tempat'}.<br><br>` +
                  "Ada catatan khusus? (contoh: pedas level 2, sambal extra, tanpa kecap)",
            quickReplies: ["Tidak ada", "Pedas level 2", "Sambal extra", "Tanpa kecap"],
            isQuestion: true,
            contextKey: 'order_notes'
        };
    }
    

    if (order.notes === '' && !lowerMessage.match(/tidak ada|ga ada|enggak/)) {
        order.notes = message;
        

        if (order.deliveryMethod === 'delivery' && !conversationContext.userPreferences.phoneNumber) {
            return {
                text: "📱 Untuk pengiriman, kami butuh nomor WhatsApp Anda:<br><br>" +
                      "Silakan ketik nomor WhatsApp Anda (contoh: 08123456789)",
                isQuestion: true,
                contextKey: 'phone_number'
            };
        } else {
            return confirmOrder();
        }
    }
    

    if (conversationContext.lastQuestion === 'phone_number') {
        const phoneMatch = message.match(/(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/);
        if (phoneMatch) {
            conversationContext.userPreferences.phoneNumber = phoneMatch[0];
            return confirmOrder();
        } else {
            return {
                text: "Nomor WhatsApp tidak valid. Silakan ketik nomor WhatsApp Anda (contoh: 08123456789)",
                isQuestion: true,
                contextKey: 'phone_number'
            };
        }
    }
    

    if (lowerMessage.match(/ya|yes|betul|benar|pesan sekarang|konfirmasi|oke|ok/)) {
        return completeOrder();
    }
    

    if (lowerMessage.match(/batal|gak jadi|enggak|tidak/)) {
        conversationContext.orderInProgress = null;
        return {
            text: "Oke, pesanan dibatalkan. Ada lagi yang bisa saya bantu?",
            quickReplies: ["Lihat menu", "Promo", "Lokasi"]
        };
    }
    
    return null;
}

function confirmOrder() {
    const order = conversationContext.orderInProgress;
    const totalPrice = calculatePrice(order.item, order.quantity);
    
    let confirmationText = `📝 <b>Konfirmasi Pesanan:</b><br>
                          - Menu: ${order.item === 'Kombo' ? 'Paket Kombo' : 'Dimsum '+order.item}<br>
                          - Jumlah: ${order.quantity} paket<br>
                          - ${order.deliveryMethod === 'delivery' ? 'Diantar' : 'Ambil di tempat'}<br>`;
    
    if (order.deliveryMethod === 'delivery' && conversationContext.userPreferences.phoneNumber) {
        confirmationText += `- Nomor WhatsApp: ${conversationContext.userPreferences.phoneNumber}<br>`;
    }
    
    if (order.notes) {
        confirmationText += `- Catatan: ${order.notes}<br>`;
    }
    
    confirmationText += `<br>- Total: Rp${totalPrice.toLocaleString('id-ID')}<br><br>`;
    
    if (order.deliveryMethod === 'delivery') {
        confirmationText += "💡 <i>Ongkir akan dihitung setelah konfirmasi alamat via WhatsApp</i><br><br>";
    }
    
    confirmationText += "Sudah benar?";
    
    return {
        text: confirmationText,
        quickReplies: ["Ya, pesan sekarang", "Ubah pesanan", "Batal"],
        isQuestion: true,
        contextKey: 'order_confirmation'
    };
}

function completeOrder() {
    const order = conversationContext.orderInProgress;
    const totalPrice = calculatePrice(order.item, order.quantity);
    

    const orderId = 'SVG-' + Date.now().toString().slice(-6);
    order.orderId = orderId;
    order.orderDate = new Date().toLocaleString('id-ID');
    order.totalPrice = totalPrice;
    

    conversationContext.orderHistory.push(order);
    conversationContext.userPreferences.lastOrder = order;
    

    let whatsappMessage = `Halo, saya mau pesan:\n\n`;
    whatsappMessage += `*Order ID:* ${orderId}\n`;
    whatsappMessage += `*Menu:* ${order.item === 'Kombo' ? 'Paket Kombo' : 'Dimsum '+order.item}\n`;
    whatsappMessage += `*Jumlah:* ${order.quantity} paket\n`;
    whatsappMessage += `*Metode:* ${order.deliveryMethod === 'delivery' ? 'Diantar' : 'Ambil di tempat'}\n`;
    
    if (order.deliveryMethod === 'delivery' && conversationContext.userPreferences.phoneNumber) {
        whatsappMessage += `*Nomor WhatsApp:* ${conversationContext.userPreferences.phoneNumber}\n`;
    }
    
    if (order.notes) {
        whatsappMessage += `*Catatan:* ${order.notes}\n`;
    }
    
    whatsappMessage += `\n*Total:* Rp${totalPrice.toLocaleString('id-ID')}\n\n`;
    
    if (order.deliveryMethod === 'delivery') {
        whatsappMessage += `Silakan balas dengan alamat lengkap pengiriman untuk menghitung ongkir.\n`;
    }
    
    whatsappMessage += `Terima kasih!`;
    
    const whatsappUrl = `https://wa.me/${whatsappBusinessNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    

    console.log("Order completed:", order);
    
    conversationContext.orderInProgress = null;
    
    return {
        text: `🎉 <b>Pesanan Diterima!</b><br><br>` +
              `*Order ID:* ${orderId}<br>` +
              `Menu: ${order.item === 'Kombo' ? 'Paket Kombo' : 'Dimsum '+order.item}<br>` +
              `Jumlah: ${order.quantity} paket<br>` +
              `Total: Rp${totalPrice.toLocaleString('id-ID')}<br><br>` +
              `Untuk melanjutkan dan mendapatkan update pesanan, silakan klik tombol di bawah ini:<br><br>` +
              `<a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">Lanjutkan via WhatsApp</a><br><br>` +
              `Pesanan akan diproses setelah konfirmasi via WhatsApp.`,
        quickReplies: ["Status pesanan", "Menu lain", "Selesai"]
    };
}

function calculatePrice(item, quantity) {
    const prices = {
        'Original': 25000,
        'Mentai': 30000,
        'Ayam': 30000,
        'Ikan': 30000,
        'Pedas': 28000,
        'Kombo': 100000  
    };
    return prices[item] * quantity;
}

function handleFollowUp(message) {
    const lastQ = conversationContext.lastQuestion;
    if (!lastQ) return null;
    
    const lowerMessage = message.toLowerCase();
    

    if (lastQ === 'menu_selection') {
        return handleOrderInitiation(lowerMessage);
    }
    

    if (lastQ === 'order_confirmation') {
        if (lowerMessage.includes('ubah')) {
            conversationContext.orderInProgress = null;
            return {
                text: "Oke, silakan pilih menu lagi:",
                quickReplies: ["Original", "Mentai", "Ayam", "Ikan", "Pedas", "Kombo"],
                isQuestion: true,
                contextKey: 'menu_selection'
            };
        }
    }
    
    return null;
}


document.addEventListener('DOMContentLoaded', function() {
    const chatbotPopup = document.getElementById('chatbotPopup');
    if (chatbotPopup) {
        chatbotPopup.style.display = 'none';
    }
    

    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('focus', function() {
            this.parentElement.style.boxShadow = '0 0 0 2px #4CAF50';
        });
        userInput.addEventListener('blur', function() {
            this.parentElement.style.boxShadow = 'none';
        });
    }
});


document.addEventListener('click', function(event) {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotPopup = document.getElementById('chatbotPopup');
    
    if (chatbotPopup && (chatbotPopup.style.display === 'flex' || chatbotPopup.style.display === 'block')) {
        if (!chatbotContainer.contains(event.target)) {
            chatbotPopup.style.display = 'none';
        }
    }
});


document.addEventListener('touchstart', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        document.body.style.zoom = '0.99';
    }
});

document.addEventListener('touchend', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        setTimeout(function() {
            document.body.style.zoom = '';
        }, 100);
    }
});
