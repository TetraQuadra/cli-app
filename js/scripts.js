$(document).ready(function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Оновлення лічильника кошика при завантаженні сторінки
    updateCartCount();
    updateCartTotal();

    $('#btn-menu').click(function () {
        $(this).toggleClass('active');
        $('#sidebar').toggleClass('active');
        $('#wrapper').toggleClass('toggled');
    });

    // Додаємо товар до кошика
    $('.add-to-cart').click(function() {
        let productId = $(this).data('product-id');
        let productPrice = $(this).data('product-price');
        let productTitle = $(this).parent().find('h2').text();

        if (cart[productId]) {
            cart[productId].quantity += 1;
        } else {
            cart[productId] = {
                price: productPrice,
                quantity: 1,
                title: productTitle,
            };
        }

        saveCart();
        updateCartCount();
        updateCartTotal();
    });

    // Оновлення лічильника кошика
    function updateCartCount() {
        let totalCount = 0;
        for (let productId in cart) {
            $('.add-to-cart[data-product-id="' + productId + '"]').attr('disabled', 'disabled').text('В кошику');
            totalCount += cart[productId].quantity;
        }
        $('.cart-icon span').text(totalCount);
        if (totalCount > 0) {
            $('#checkout').removeAttr('disabled');
        } else {
            $('#checkout').attr('disabled', 'disabled');
        }
    }

    // Оновлення загальної вартості кошика
    function updateCartTotal() {
        let total = 0;
        for (let productId in cart) {
            total += cart[productId].price * cart[productId].quantity;
        }
        $('#cart-total').text(total);
    }

    // Збереження кошика у локальне сховище
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Відображення товарів у кошику
    function displayCartItems() {
        $('#cart-items').empty();

        for (let productId in cart) {
            let item = cart[productId];
            $('#cart-items').append(`
                <div class="cart-item">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price">${item.price} грн</span>
                    <span class="cart-item-quantity">
                        <button class="quantity-change" data-product-id="${productId}" data-change="decrease">-</button>
                        ${item.quantity}
                        <button class="quantity-change" data-product-id="${productId}" data-change="increase">+</button>
                    </span>
                    <span>${item.price * item.quantity} грн</span>
                    <button class="remove-item" data-product-id="${productId}">&times;</button>
                </div>
            `);
        }
    }

    // Зміна кількості товару
    $(document).on('click', '.quantity-change', function() {
        let productId = $(this).data('product-id');
        let change = $(this).data('change');

        if (change === 'increase') {
            cart[productId].quantity += 1;
        } else if (change === 'decrease' && cart[productId].quantity > 1) {
            cart[productId].quantity -= 1;
        }

        saveCart();
        displayCartItems();
        updateCartCount();
        updateCartTotal();
    });

    // Видалення товару з кошика
    $(document).on('click', '.remove-item', function() {
        let productId = $(this).data('product-id');
        delete cart[productId];
        $('.add-to-cart[data-product-id="' + productId + '"]').removeAttr('disabled').text('Купити');

        saveCart();
        displayCartItems();
        updateCartCount();
        updateCartTotal();
    });

    // Відправка замовлення в телеграм бота
    $('#checkout').click(function() {
        let data = '';
        const name = $('#cart input[name="name"]').val();
        const phone = $('#cart input[name="phone"]').val();
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Місяці від 0 до 11
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        data += `*Ім'я:* ${name}\n`;
        data += `*Телефон:* ${phone}\n`;
        data += `*Дата:* ${year}-${month}-${day} ${hours}:${minutes}:${seconds}\n`;
        data += `*Сайт:* ${window.location.hostname}\n`;
        data += `*Товари:*\n`;

        for (let productId in cart) {
            let item = cart[productId];
            data += `*Product ID:* ${productId}\n`;
            data += `*Назва:* ${item.title}\n`;
            data += `*Ціна:* ${item.price}\n`;
            data += `*Кількість:* ${item.quantity}\n\n`;
        }

        $(this).hide();
        $('.img-loading').css('display', 'block');

        $.ajax({
            url: 'https://api.telegram.org/bot7014880951:AAGWGOZbvOSXJoNemS42etq8IXM23MlgYRM/sendMessage',
            method: 'POST',
            data: {
                chat_id: '-4288164357',
                text: '*Замовлення:*\n' + data,
                parse_mode: "Markdown"
            },
            success: function(response) {
                alert('Замовлення успішне!');
                cart = {};
                saveCart();
                displayCartItems();
                updateCartCount();
                updateCartTotal();
                $('#checkout').show();
                $('.img-loading').css('display', 'none');
            },
            error: function(response) {
                alert('Замовлення невдалось!');
                $('#checkout').show();
                $('.img-loading').css('display', 'none');
            }
        });
    });

    /* scroll */

    $("a[href^='#']").click(function(){
        var target = $(this).attr("href");
        var product = $(this).parent().find("h2.title").text();
        $("#order_form select[name='type'] option[value='"+product+"']").prop("selected", true);
        $("html, body").animate({scrollTop: $(target).offset().top - 70 +"px"});
        return false;
    });

    /* timer */

    function update() {
        var Now = new Date(), Finish = new Date();
        Finish.setHours( 23);
        Finish.setMinutes( 59);
        Finish.setSeconds( 59);
        if( Now.getHours() === 23  &&  Now.getMinutes() === 59  &&  Now.getSeconds === 59) {
            Finish.setDate( Finish.getDate() + 1);
        }
        var sec = Math.floor( ( Finish.getTime() - Now.getTime()) / 1000);
        var hrs = Math.floor( sec / 3600);
        sec -= hrs * 3600;
        var min = Math.floor( sec / 60);
        sec -= min * 60;
        $(".timer .hours").html( pad(hrs));
        $(".timer .minutes").html( pad(min));
        $(".timer .seconds").html( pad(sec));
        setTimeout( update, 200);
    }
    function pad(s) {
        s = ("00"+s).substr(-2);
        return "<span>" + s[0] + "</span><span>" + s[1] + "</span>";
    }
    update();
    $(function() {
        var Accordion = function(el, multiple) {
            this.el = el || {};
            // more then one submenu open?
            this.multiple = multiple || false;

            var dropdownlink = this.el.find('.dropdownlink');
            dropdownlink.on('click',
                { el: this.el, multiple: this.multiple },
                this.dropdown);
        };

        Accordion.prototype.dropdown = function(e) {
            var $el = e.data.el,
                $this = $(this),
                $next = $this.next();

            $next.slideToggle();
            $this.parent().toggleClass('open');

            if(!e.data.multiple) {
                //show only one menu at the same time
                $el.find('.submenuItems').not($next).slideUp().parent().removeClass('open');
            }
        }
        var accordion = new Accordion($('.accordion-menu'), false);
    });
    $(".modal").each(function () {
        $(this).wrap('<div class="overlay"></div>')
    });

    $(".open-modal").on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation;
        var $this = $(this),
            modal = $($this).data("modal");
        $(modal).parents(".overlay").addClass("open");
        setTimeout(function () {
            $(modal).addClass("open");
        }, 150);
        $(document).on('click', function (e) {
            var target = $(e.target);
            if ($(target).hasClass("overlay")) {
                $(target).find(".modal").each(function () {
                    $(this).removeClass("open");
                });
                setTimeout(function () {
                    $(target).removeClass("open");
                }, 150);
            }
        });
    });

    $(".close-modal").on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation;
        document.body.style.overflow = "auto";
        $(".modal").removeClass("open");

        //$(modal).removeClass("open");
        setTimeout(function () {
            $(".modal").parents(".overlay").removeClass("open");
        }, 350);

    });
    $(".open-cart").click(function(){
        displayCartItems();
    });
});

$(window).on("load", function(){
    $(".owl-carousel").owlCarousel({
        items: 1,
        loop: true,
        autoHeight: true,
        smartSpeed: 300,
        mouseDrag: false,
        pullDrag: false,
        nav: true,
        navText: ""
    });
});
