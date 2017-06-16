'use strict';

var homeButton = document.getElementById('home-button');
var listButton = document.getElementById('list-button');

homeButton.onclick = function() {
  window.location.href = '/';
};

listButton.onclick = function() {
  window.location.href = '/list';
};

var isListPage = listButton.classList.contains('active');

/* ------------------------------------------------------- */

window.onclick = function(event) {
  if (isListPage) {
    if (event.target == modalCreate) {
      modalCreate.style.display = 'none';
      modalBackdrop.style.display = 'none';
    }
  }
};

/* ------------------------------------------------------- */

var modalBackdrop = document.getElementById('modal-backdrop');

/* ------------------------------------------------------- */

function searchItem() {
  var count = document.querySelectorAll('.item-text').length;
  var squery = document.getElementById('search-input').value;

  var items = document.getElementsByClassName('item');
  var itemTexts = document.getElementsByClassName('item-text');
  var itemAttrs = document.getElementsByClassName('item-attribution');

  for (var i = 0; i < count; ++i) {
    if (itemTexts[i].innerText.includes(squery) ||
        itemAttrs[i].innerText.includes(squery)) {
      items[i].style.display = 'flex';
    } else {
      items[i].style.display = 'none';
    }
  }
  }

function removeItem(id) {
  var xhr = new XMLHttpRequest();
  var url = 'item/remove';
  var params = 'id=' + id;

  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  // Call a function when the state changes.
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        modalBackdrop.style.display = 'none';
        window.location.reload(true);
      } else {
        alert(xhr.responseText || 'unknown error');
      }
    }
  };
  xhr.send(params);
  }

if (isListPage) {
  document.getElementById('search-input')
      .setAttribute('oninput', 'searchItem()');

  var createButton = document.getElementById('create-button');

  var modalCreate = document.getElementById('modal-create');

  var closeCreate = document.getElementById('modal-close-create');
  var cancelCreate = document.getElementById('modal-cancel-create');
  var acceptCreate = document.getElementById('modal-accept-create');

  closeCreate.onclick = cancelCreate.onclick = function() {
    modalCreate.style.display = 'none';
    modalBackdrop.style.display = 'none';
  };

  createButton.onclick = function() {
    modalBackdrop.style.display = 'block';
    modalCreate.style.display = 'block';
  };

  acceptCreate.onclick = function() {
    var name = document.getElementById('name').value.replace(/\s/g, '');
    var price = document.getElementById('price').value.replace(/\s/g, '');

    // If any field is left empty, create an alert
    if (name === '') {
      alert('Please enter item name!');
      return;
      }

    if (price === '') {
      alert('Please enter item price!');
      return;
      }

    var xhr = new XMLHttpRequest();
    var url = 'item/create';
    var params = 'name=' + name + '&price=' + price;

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Call a function when the state changes.
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          modalBackdrop.style.display = 'none';
          window.location.reload(true);
        } else {
          alert(xhr.responseText || 'unknown error');
        }
      }
    };
    xhr.send(params);

    modalCreate.style.display = 'none';
    modalBackdrop.style.display = 'none';
  };
}