const outfitForm = document.getElementById('outfitForm');
const outfitList = document.getElementById('outfitList');

// Load outfits from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedOutfits = JSON.parse(localStorage.getItem('outfits')) || [];
  savedOutfits.forEach(outfit => addOutfit(outfit.name, outfit.category, outfit.image, false));
});

outfitForm.addEventListener('submit', function(e) {
  e.preventDefault(); // doesn't sumbit it

  const name = document.getElementById('outfitName').value;
  const category = document.querySelector('input[name="OutfitCategory"]:checked').value;
  const image = document.getElementById('outfitImage').value;

  addOutfit(name, category, image);

  outfitForm.reset();
});

//adds outfit
function addOutfit(name, category, image, save = true) {
  const outfitCard = document.createElement('div');
  outfitCard.classList.add('outfit-card', category.toLowerCase());
  outfitCard.innerHTML = `
    <img src="${image}" alt="${name}">
    <h3>${name}</h3>
    <p>${category}</p>
    <button onclick="removeOutfit(this)">Remove</button>
  `;

  outfitList.appendChild(outfitCard);

  if (save) {
    const outfits = JSON.parse(localStorage.getItem('outfits')) || [];
    outfits.push({ name, category, image });
    localStorage.setItem('outfits', JSON.stringify(outfits));
  }
}

//removes outfit
function removeOutfit(button) {
  const outfitCard = button.parentElement;
  const name = outfitCard.querySelector('h3').innerText;
  const category = outfitCard.querySelector('p').innerText;
  const image = outfitCard.querySelector('img').src;

  outfitCard.remove();

  // Remove from localStorage
  const outfits = JSON.parse(localStorage.getItem('outfits')) || [];
  const updatedOutfits = outfits.filter(o => !(o.name === name && o.category === category && o.image === image));
  localStorage.setItem('outfits', JSON.stringify(updatedOutfits));
}


const categoryFilter = document.getElementById('categoryFilter');

categoryFilter.addEventListener('change', function() {
  const filter = this.value; // "Casual", "Formal", "Sport", or "all"
  const outfits = document.querySelectorAll('.outfit-card');

  outfits.forEach(outfit => {
    if (filter === 'all' || outfit.classList.contains(filter.toLowerCase())) {
      outfit.style.display = 'block';
    } else {
      outfit.style.display = 'none';
    }
  });
});
