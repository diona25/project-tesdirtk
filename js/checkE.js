document.addEventListener("DOMContentLoaded", function () {
  // Récupérer les éléments du panier depuis le localStorage
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  let cartPrice = 0;

  // Calculer le prix total du panier
  cartItems.forEach(item => {
    cartPrice += item.price * item.quantity;
  });

  // Afficher le prix des produits
  document.getElementById("productPrice").innerText = cartPrice;

  // Définir les frais de livraison
  const shippingPrice = 50; // Frais de livraison fixes
  document.getElementById("shippingPrice").innerText = shippingPrice;

  // Mettre à jour le prix total initial
  updateTotalPrice(cartPrice, shippingPrice);

  // Gérer l'affichage des détails de la carte de crédit
  function togglePaymentFields() {
    const cardDetails = document.getElementById("cardDetails");
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

    if (paymentMethod) {
      cardDetails.style.display = (paymentMethod.value === "card") ? "block" : "none";
      updateTotalPrice(cartPrice, shippingPrice); // Mettre à jour le prix total
    }
  }

  // Ajouter des écouteurs d'événements pour les boutons de paiement
  document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
    input.addEventListener("change", togglePaymentFields);
  });

  // Mettre à jour le prix total en fonction du mode de paiement
  function updateTotalPrice(productPrice, shippingPrice) {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    let totalPrice = productPrice + shippingPrice;



    // Afficher le prix total
    document.getElementById("totalPrice").innerText = `${totalPrice} DZD`;
  }

  // Confirmer la commande
  function confirmOrder() {
    const name = document.getElementById("customerName").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const wilaya = document.getElementById("wilayaSelect").value;
    const office = document.getElementById("officeSelect").value;
    const paymentMethodElement = document.querySelector('input[name="paymentMethod"]:checked');

    if (!name || !address || !wilaya || !office || !paymentMethodElement) {
      alert("Please fill in all required fields.");
      return;
    }

    const paymentMethod = paymentMethodElement.value;

    // Vérifier les informations de la carte si le mode de paiement est "Credit Card"
    if (paymentMethod === "card") {
      const cardHolderName = document.getElementById("cardHolderName").value.trim();
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const cardExpiry = document.getElementById("cardExpiry").value;
      const cardCVV = document.getElementById("cardCVV").value.trim();

      if (!cardHolderName || !cardNumber || !cardExpiry || !cardCVV) {
        alert("Please enter all card details.");
        return;
      }
    }

    const totalPrice = document.getElementById("totalPrice").innerText;
    const orderDetails = `✅ Thank you, ${name}! Your order has been confirmed.
📍 Address: ${address}, ${wilaya} (${office})
🛒 Payment Method: ${paymentMethod === "card" ? "Credit Card" : "Cash on Delivery"}
💰 Total: ${totalPrice}`;

    document.getElementById("orderConfirmation").innerText = orderDetails;
  }

  // Ajouter un écouteur d'événement pour le bouton de confirmation de paiement
  document.getElementById("confirmPayment").addEventListener("click", confirmOrder);

  // Liste des wilayas et bureaux de poste
  const wilayas = {
    "Adrar": ["Main Post Office of Adrar", "Timimoun Post Office"],
    "Chlef": ["Central Post Office of Chlef", "Ouled Fares Post Office"],
    "Laghouat": ["Main Post Office of Laghouat", "Aïn Madhi Post Office"],
    "Oum El Bouaghi": ["Central Post Office of Oum El Bouaghi", "Aïn Beïda Post Office"],
    "Batna": ["Main Post Office of Batna", "Arris Post Office"],
    "Béjaïa": ["Central Post Office of Béjaïa", "Oukas Post Office"],
    "Biskra": ["Main Post Office of Biskra", "Tolga Post Office"],
    "Béchar": ["Central Post Office of Béchar", "Kenadsa Post Office"],
    "Blida": ["Central Post Office of Blida", "Oued El Alleug Post Office"],
    "Bouira": ["Central Post Office of Bouira", "Sour El Ghozlane Post Office"],
    "Tamanrasset": ["Main Post Office of Tamanrasset", "In Salah Post Office"],
    "Tébessa": ["Central Post Office of Tébessa", "El Chéria Post Office"],
    "Tlemcen": ["Main Post Office of Tlemcen", "Maghnia Post Office"],
    "Tiaret": ["Central Post Office of Tiaret", "Frenda Post Office"],
    "Tizi Ouzou": ["Central Post Office of Tizi Ouzou", "Azzazga Post Office"],
    "Algiers": ["Central Post Office of Algiers", "Bab El Oued Post Office", "El Harrach Post Office"],
    "Djelfa": ["Main Post Office of Djelfa", "Messaad Post Office"],
    "Jijel": ["Central Post Office of Jijel", "Taher Post Office"],
    "Sétif": ["Main Post Office of Sétif", "El Eulma Post Office"],
    "Saïda": ["Central Post Office of Saïda", "El Hassasna Post Office"],
    "Skikda": ["Central Post Office of Skikda", "Azzaba Post Office"],
    "Annaba": ["Central Post Office of Annaba", "El Bouni Post Office"],
    "Oran": ["Central Post Office of Oran", "Aïn El Turk Post Office"],
    "El Bayadh": ["Central Post Office of El Bayadh", "Bougtoub Post Office"],
    "Illizi": ["Central Post Office of Illizi", "Djanet Post Office"],
    "Bordj Bou Arréridj": ["Central Post Office of Bordj Bou Arréridj", "Medjana Post Office"],
    "Boumerdès": ["Central Post Office of Boumerdès", "Boudouaou Post Office"],
    "El Tarf": ["Central Post Office of El Tarf", "El Kala Post Office"]
};
  const wilayaSelect = document.getElementById("wilayaSelect");
  const officeSelect = document.getElementById("officeSelect");

  // Ajouter les wilayas au menu déroulant
  Object.keys(wilayas).forEach(wilaya => {
    const option = new Option(wilaya, wilaya);
    wilayaSelect.add(option);
  });

  // Mettre à jour les bureaux de poste lorsque la wilaya change
  wilayaSelect.addEventListener("change", function () {
    officeSelect.innerHTML = '<option value="">اختر مكتب التوصيل...</option>';
    const offices = wilayas[this.value] || [];
    offices.forEach(office => {
      const option = new Option(office, office);
      officeSelect.add(option);
    });
  });
});