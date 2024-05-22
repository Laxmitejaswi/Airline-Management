document.addEventListener('DOMContentLoaded', function() {
    var customSelectContainers = document.querySelectorAll('.custom-select-container');

    customSelectContainers.forEach(function(container) {
        var selected = container.querySelector('.select-selected');
        var itemsContainer = container.querySelector('.select-items');
        var items = container.querySelectorAll('.select-item');
        var searchInput = container.querySelector('.select-search');

        selected.addEventListener('click', function() {
            itemsContainer.classList.toggle('select-hide');
            selected.classList.toggle('select-arrow-active');
            searchInput.value = ''; 
            filterItems('', items); 
        });

        items.forEach(function(item) {
            item.addEventListener('click', function() {
                selected.textContent = this.textContent;
                itemsContainer.classList.add('select-hide');
            });
        });

        searchInput.addEventListener('input', function() {
            filterItems(this.value, items);
        });

        document.addEventListener('click', function(event) {
            if (!container.contains(event.target)) {
                itemsContainer.classList.add('select-hide');
                selected.classList.remove('select-arrow-active');
            }
        });
    });

    function filterItems(query, items) {
        var lowerCaseQuery = query.toLowerCase();
        items.forEach(function(item) {
            var text = item.textContent.toLowerCase();
            if (text.includes(lowerCaseQuery)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
});
