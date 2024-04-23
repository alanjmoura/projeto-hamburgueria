// TODAS REFERÊNCIAS QUE PRECISAM MANIPULAR

const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const spanItem = document.getElementById("date-span")

    // COMANDO PARA FUNÇÃO ADICIONAR PARA LISTA CARRINHO
let cart = [];

    // Abrir o modal menu do carrinho
cartBtn.addEventListener("click",function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

    // Fechar o modal menu quando clicar no buttom "fechar"
closeModalBtn.addEventListener("click",function () {
    cartModal.style.display = "none"
})

    // Fechar o modal menu quando clicar fora da div mãe
cartModal.addEventListener("click", function(event){
    if(event.target == cartModal){
        cartModal.style.display = "none"
    }
})


menu.addEventListener("click", function(event){

   let parentButton = event.target.closest(".add-to-cart-btn")

   if(parentButton){
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))

    // Adicionar no carrinho
    addToCart(name, price)
   }
})

    // Função para adicionar no carrinho

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //If/Se o item já existe, aumenta apenas a quantidade +!
        existingItem.qtt += 1;

    }else{  //If/Se não, Ele vai adicionar no carrinho:
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

}
    //Atualize o  carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
                </button>
            </div>
            `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemsElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

    // Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){ 
    const name = event.target.getAttribute("data-name")

    removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }   
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.valeu;

    // Quando digitar no input, irá desaparecer o addressWarn e border red
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

    // Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    // Se tiver fora do horário de funcionamento, vai disparar um alert ao tentar Finalizar pedido
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
            background: "#ef4444",
            },
        }).showToast();
        return;
}


    if(cart.length == 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }


    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: ${item.quantity} Preço: ${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "13991386066"

    window.open(`https://wa.me/${phone}?${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23; //true = Restaurante está aberto nesse horário
}


const isOpen = checkRestaurantOpen();

if(isOpen){ //Se tiver entre 18hs e 23hs:
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")

}else{ //Se não tiver entre 18hs e 23hs:
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500")

}
