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
    document.getElementById("totalPrice").innerText = `${totalPrice} $`;
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
    "أدرار": ["مكتب أدرار الرئيسي", "مكتب تيميمون"],
    "الشلف": ["مكتب الشلف المركزي", "مكتب أولاد فارس"],
    "الأغواط": ["مكتب الأغواط الرئيسي", "مكتب عين ماضي"],
    "أم البواقي": ["مكتب أم البواقي المركزي", "مكتب عين البيضاء"],
    "باتنة": ["مكتب باتنة الرئيسي", "مكتب أريس"],
    "بجاية": ["مكتب بجاية المركزي", "مكتب أوقاس"],
    "بسكرة": ["مكتب بسكرة الرئيسي", "مكتب طولقة"],
    "بشار": ["مكتب بشار المركزي", "مكتب القنادسة"],
    "البليدة": ["مكتب البليدة المركزي", "مكتب واد العلايق"],
    "البويرة": ["مكتب البويرة المركزي", "مكتب سور الغزلان"],
    "تمنراست": ["مكتب تمنراست الرئيسي", "مكتب عين صالح"],
    "تبسة": ["مكتب تبسة المركزي", "مكتب الشريعة"],
    "تلمسان": ["مكتب تلمسان الرئيسي", "مكتب مغنية"],
    "تيارت": ["مكتب تيارت المركزي", "مكتب فرندة"],
    "تيزي وزو": ["مكتب تيزي وزو المركزي", "مكتب عزازقة"],
    "الجزائر": ["مكتب البريد المركزي", "مكتب باب الواد", "مكتب الحراش"],
    "الجلفة": ["مكتب الجلفة الرئيسي", "مكتب مسعد"],
    "جيجل": ["مكتب جيجل المركزي", "مكتب الطاهير"],
    "سطيف": ["مكتب سطيف الرئيسي", "مكتب العلمة"],
    "سعيدة": ["مكتب سعيدة المركزي", "مكتب الحساسنة"],
    "سكيكدة": ["مكتب سكيكدة المركزي", "مكتب عزابة"],
    "عنابة": ["مكتب عنابة المركزي", "مكتب البوني"],
    "وهران": ["مكتب وهران المركزي", "مكتب عين الترك"],
    "البيض": ["مكتب البيض المركزي", "مكتب بوقطب"],
    "اليزي": ["مكتب اليزي المركزي", "مكتب جانت"],
    "برج بوعريريج": ["مكتب برج بوعريريج المركزي", "مكتب مجانة"],
    "بومرداس": ["مكتب بومرداس المركزي", "مكتب بودواو"],
    "الطارف": ["مكتب الطارف المركزي", "مكتب القالة"]
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