let bioEl = document.querySelector(".bio-element")
let bioDesc = document.querySelector(".footer_text-description") 
bioDesc.style.display = "none"
let lists = document.querySelector("#list")

lists.style.display = "none"
bioEl.onclick = () => {
    bioDesc.style.display = "block"
    document.querySelector(".bio-down").style.display = "none"
}
let element = document.querySelector(".element")
element.onclick = () => {
    lists.style.display = "block"
    document.querySelector(".ln-down").style.display = "none"
}



// perform add to cart

document.addEventListener('DOMContentLoaded', function () {
    var addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();

        var productId = button.parentNode.querySelector('.prod_id').value;
        var quantity = button.parentNode.querySelector('#quantity').value;

          var message = document.createElement('div');
        // message.innerHTML = 'Produit ajouté au panier';
        message.classList.add('add-to-cart-message');

        button.parentNode.appendChild(message);

        addToCart(productId, quantity);
        setTimeout(function () {
          message.remove();
        }, 3000);
       
      });
    });
  });

  function addToCart(productId, quantity) {
    var data = {
      items: [
        {
          quantity: parseInt(quantity, 10),
          id: productId
        }
      ]
    };

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      if (response.status == 200) {
        document.querySelector(".add-to-cart-message").innerHTML = 'Produit ajouté au panier';
        
        getCartItemCount();
        updateCartATC();
        window.location.reload()
      } else {
        document.querySelector(".add-to-cart-message").innerHTML = 'erreur plus que {{ products }}';
        // Gérer les erreurs lors de l'ajout au panier
      }
    })
    .catch(function(error) {
       // var message = document.createElement('div');
       //  message.innerHTML = 'quantite non disponible';
       //  message.classList.add('add-to-cart-message');

       //  button.parentNode.appendChild(message);

       //  setTimeout(function () {
       //    message.remove();
       //  }, 3000);
      // Gérer les erreurs de la requête AJAX, par exemple afficher un message d'erreur
    });
  }
  function updateCartCount(count) {
    var cartCountElement = document.getElementById('viewcartcount');
    if (cartCountElement) {
      cartCountElement.textContent = count;
    }

    var cartButtonElement = document.getElementById('viewcartf');
    if (cartButtonElement) {
      if (count > 0) {
        cartButtonElement.textContent = 'VOIR MON PANIER (' + count + ')';
      } else {
        cartButtonElement.textContent = 'VOIR MON PANIER';
      }
    }
  }
  

  function getCartItemCount() {
  fetch('/cart.js', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  .then(function(response) {
    if (response.ok) {
      
      return response.json();
    }
    throw new Error('Erreur lors de la récupération des informations du panier');
  })
  .then(function(data) {
    var itemCount = 0;
    if (data && data.item_count) {
      itemCount = data.item_count;
    }
    updateCartCount(itemCount);
  })
  .catch(function(error) {
    console.error(error);
  });
}

  //lié au sticky view cart
  document.addEventListener('DOMContentLoaded', function() {
    var viewCartButton = document.getElementById('viewcart');
    var stepActionInfo = document.getElementById('step-action-info');
    var checkoutButton = document.getElementById('checkout');
    var maincheckoutButton = document.getElementById('maincheckout');


    window.addEventListener('scroll', function() {
      var scrollPosition = window.scrollY || window.pageYOffset;
     
      if (stepActionInfo && viewCartButton) {
        var stepActionInfoPosition = stepActionInfo.offsetTop;
        if (scrollPosition >= stepActionInfoPosition) {
          viewCartButton.classList.add('hidden');
          checkoutButton.classList.remove('hidden');
        } else {
          viewCartButton.classList.remove('hidden');
          checkoutButton.classList.add('hidden');
        }        
        
      }
    });
  });

  function removeFromCart(lineItemId) {
  fetch('/cart/change.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: 'quantity=0&id=' + encodeURIComponent(lineItemId)
  })
  .then(function(response) {
    if (response.ok) {
      updateCart();
      getCartItemCount();
        window.location.reload()
    } else {
      console.error('Erreur lors de la suppression du produit du panier');
    }
  })
  .catch(function(error) {
    console.error('Erreur lors de la requête AJAX pour supprimer le produit du panier', error);
  });
}


  function updateCart() {
    fetch('/cart.js', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Erreur lors de la récupération des informations du panier');
    })
    .then(function(data) {
      // Mettre à jour la liste des éléments du panier sans recharger la page
      updateCartItems(data.items);
    })
    .catch(function(error) {
      console.error(error);
    });
  }

  function updateCartItems(items) {
  var infoItems = document.querySelectorAll('.info-item');

  // Convertir la liste des éléments en tableau pour faciliter la manipulation
  var itemsArray = Array.from(items);

  infoItems.forEach(function(infoItem) {
    var lineItemId = infoItem.getAttribute('data-line-item-id');

    // Vérifier si l'élément existe toujours dans le panier
    var existingItem = itemsArray.find(function(item) {
      return item.key === lineItemId;
    });

    if (existingItem) {
      // Mettre à jour les informations de l'élément dans l'interface
      var quantityElement = infoItem.querySelector('.item-quantity');
      if (quantityElement) {
        quantityElement.textContent = 'x ' + existingItem.quantity;
      }
    } else {
      // L'élément a été supprimé du panier, le supprimer de l'interface
      infoItem.remove();
    }
  });
}
  
function updateCartATC() {
  fetch('/cart.js', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  .then(function(response) {
    if (response.ok) {
      
      return response.json();
    }
    throw new Error('Erreur lors de la récupération des informations du panier');
  })
  .then(function(data) {
    var cartItems = data.items;
        updateTotalPrice(data.total_price)
    var infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(function(infoItem) {
      var lineItemId = infoItem.getAttribute('data-line-item-id');
      var matchingItem = cartItems.find(function(item) {
        return item.key === lineItemId;
      });

      if (matchingItem) {
        var quantityElement = infoItem.querySelector('.item-quantity');
        if (quantityElement) {
          quantityElement.textContent = 'x ' + matchingItem.quantity;
        }
      } else {
        infoItem.remove();
      }
    });
  })
  .catch(function(error) {
    console.error(error);
  });
}
