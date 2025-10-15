const outfitForm = document.getElementById('outfitForm');
const outfitList = document.getElementById('outfitList');
const categoryFilter = document.getElementById('categoryFilter');

// Load outfits from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedOutfits = JSON.parse(localStorage.getItem('outfits')) || [];
  
  // FIX: Generate id for old outfits that don't have one, then save back
  let needsUpdate = false;
  savedOutfits.forEach(outfit => {
    if (!outfit.id) {
      outfit.id = Date.now() + Math.random().toString(36).substr(2, 9);
      needsUpdate = true;
    }
    addOutfit(outfit.name, outfit.category, outfit.image, outfit.date, outfit.id, false);
  });
  
  // Update localStorage if we added ids to old outfits
  if (needsUpdate) {
    localStorage.setItem('outfits', JSON.stringify(savedOutfits));
  }
});

// Autofill today's date
window.addEventListener('load', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('outfitDate').value = today;
});

outfitForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('outfitName').value;
  const category = document.querySelector('input[name="OutfitCategory"]:checked').value;
  const imageFile = document.getElementById('outfitImage').files[0];
  const date = document.getElementById('outfitDate').value;

  if (imageFile) {
    const reader = new FileReader();

    reader.onload = function(event) {
      const imageUrl = event.target.result;
      // FIX: Generate id here and pass it
      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      addOutfit(name, category, imageUrl, date, id, true);
    };

    reader.readAsDataURL(imageFile);
  }

  outfitForm.reset();
  // Reset to today's date after form reset
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('outfitDate').value = today;
});

// FIX: Added id parameter so it can be passed when loading saved outfits
function addOutfit(name, category, image, date, id, save = true) {
  const outfitCard = document.createElement('div');
  outfitCard.classList.add('outfit-card', category.toLowerCase());
  outfitCard.dataset.id = id;

  outfitCard.innerHTML = `
    <img src="${image}" alt="${name}">
    <h3>${name}</h3>
    <p>${category}</p>
    <p><strong>Worn on:</strong><br>${date}</p>
    <button onclick="removeOutfit(this)">Remove</button>
  `;

  outfitList.appendChild(outfitCard);

  // FIX: Apply current filter to newly added outfit
  applyFilter();

  if (save) {
    const outfits = JSON.parse(localStorage.getItem('outfits')) || [];
    outfits.push({ id, name, category, image, date });
    localStorage.setItem('outfits', JSON.stringify(outfits));
  }
}

function removeOutfit(button) {
  const outfitCard = button.parentElement;
  const id = outfitCard.dataset.id;

  // Remove from DOM
  outfitCard.remove();

  // Remove from localStorage by unique id
  const outfits = JSON.parse(localStorage.getItem('outfits')) || [];
  const updatedOutfits = outfits.filter(o => o.id !== id);
  localStorage.setItem('outfits', JSON.stringify(updatedOutfits));
}

// FIX: Extract filter logic into reusable function
function applyFilter() {
  const filter = categoryFilter.value;
  const outfits = document.querySelectorAll('.outfit-card');

  outfits.forEach(outfit => {
    if (filter === 'all' || outfit.classList.contains(filter.toLowerCase())) {
      outfit.style.display = 'block';
    } else {
      outfit.style.display = 'none';
    }
  });
}

categoryFilter.addEventListener('change', applyFilter);