const quotes = [ 
    {text: "The best way to predict the future is to invent it.",
    category: "Innovation"},
    {text: "Life is 10% what happens to us and 90% how we react to it.",
    category: "Attitude"},
    {text: "The only way to do great work is to love what you do.",
    category: "Passion"}
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add some quotes first!</p>';
        return;
    }
    
    // Generate random index
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    // Clear previous content
    quoteDisplay.innerHTML = '';
    
    // Create blockquote element
    const blockquote = document.createElement('blockquote');
    
    // Create quote text paragraph
    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `"${randomQuote.text}"`;
    blockquote.appendChild(quoteParagraph);
    
    // Create footer for category
    const footer = document.createElement('footer');
    footer.textContent = 'Category: ';
    
    const categoryStrong = document.createElement('strong');
    categoryStrong.textContent = randomQuote.category;
    footer.appendChild(categoryStrong);
    
    blockquote.appendChild(footer);
    quoteDisplay.appendChild(blockquote);
}

// Function to create and display the add quote form (required by assignment)
function createAddQuoteForm() {
    // Check if form already exists to prevent duplicates
    if (document.getElementById('addQuoteFormContainer')) {
        return;
    }
    
    // Create main container
    const formContainer = document.createElement('div');
    formContainer.id = 'addQuoteFormContainer';
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = 'Add a New Quote';
    formContainer.appendChild(title);
    
    // Create first form group
    const firstGroup = document.createElement('div');
    firstGroup.className = 'form-group';
    
    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText';
    textInput.type = 'text';
    textInput.placeholder = 'Enter a new quote';
    textInput.className = 'form-input';
    
    firstGroup.appendChild(textInput);
    formContainer.appendChild(firstGroup);
    
    // Create second form group
    const secondGroup = document.createElement('div');
    secondGroup.className = 'form-group';
    
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    categoryInput.className = 'form-input';
    
    secondGroup.appendChild(categoryInput);
    formContainer.appendChild(secondGroup);
    
    // Create button
    const addButton = document.createElement('button');
    addButton.className = 'add-quote-btn';
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);
    
    formContainer.appendChild(addButton);
    
    // Insert the form after the newQuote button
    const newQuoteButton = document.getElementById('newQuote');
    newQuoteButton.parentNode.insertBefore(formContainer, newQuoteButton.nextSibling);
}

// Function to filter quotes by category
function filterQuotesByCategory(category) {
    const filteredQuotes = quotes.filter(quote => 
        quote.category.toLowerCase() === category.toLowerCase()
    );
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '';
        const noQuotesMsg = document.createElement('p');
        noQuotesMsg.textContent = `No quotes found in category: `;
        
        const categoryStrong = document.createElement('strong');
        categoryStrong.textContent = category;
        noQuotesMsg.appendChild(categoryStrong);
        
        quoteDisplay.appendChild(noQuotesMsg);
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    
    // Clear previous content
    quoteDisplay.innerHTML = '';
    
    // Create blockquote element
    const blockquote = document.createElement('blockquote');
    
    // Create quote text paragraph
    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `"${randomQuote.text}"`;
    blockquote.appendChild(quoteParagraph);
    
    // Create footer for category
    const footer = document.createElement('footer');
    footer.textContent = 'Category: ';
    
    const categoryStrong = document.createElement('strong');
    categoryStrong.textContent = randomQuote.category;
    footer.appendChild(categoryStrong);
    
    blockquote.appendChild(footer);
    quoteDisplay.appendChild(blockquote);
}

// Function to create category filter dropdown
function createCategoryFilter() {
    // Check if filter already exists to prevent duplicates
    if (document.getElementById('categoryFilterContainer')) {
        return;
    }
    
    // Get unique categories from quotes array
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Create main container
    const filterContainer = document.createElement('div');
    filterContainer.id = 'categoryFilterContainer';
    
    // Create label
    const label = document.createElement('label');
    label.setAttribute('for', 'categoryFilter');
    label.textContent = 'Filter by category:';
    filterContainer.appendChild(label);
    
    // Create select dropdown
    const select = document.createElement('select');
    select.id = 'categoryFilter';
    
    // Create "All Categories" option
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Categories';
    select.appendChild(allOption);
    
    // Create options for each category
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
    
    filterContainer.appendChild(select);
    
    // Insert filter before quote display
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.parentNode.insertBefore(filterContainer, quoteDisplay);
    
    // Add event listener for category filtering
    select.addEventListener('change', function() {
        const selectedCategory = this.value;
        if (selectedCategory === '') {
            showRandomQuote();
        } else {
            filterQuotesByCategory(selectedCategory);
        }
    });
}

// Function to update category filter when new quotes are added
function updateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        const currentValue = categoryFilter.value;
        
        // Clear existing options except "All Categories"
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        // Add updated categories
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        // Restore previous selection if it still exists
        if (categories.includes(currentValue)) {
            categoryFilter.value = currentValue;
        }
    }
}

// Function to add a new quote dynamically
function addQuote() {
    const quoteTextInput = document.getElementById('newQuoteText');
    const quoteCategoryInput = document.getElementById('newQuoteCategory');
    
    const quoteText = quoteTextInput.value.trim();
    const quoteCategory = quoteCategoryInput.value.trim();
    
    // Validate input
    if (quoteText === '' || quoteCategory === '') {
        // Add visual feedback for empty fields
        if (quoteText === '') {
            quoteTextInput.classList.add('error');
            quoteTextInput.placeholder = 'Quote text is required!';
        }
        if (quoteCategory === '') {
            quoteCategoryInput.classList.add('error');
            quoteCategoryInput.placeholder = 'Category is required!';
        }
        return;
    }
    
    // Reset input styling if validation passes
    quoteTextInput.classList.remove('error');
    quoteCategoryInput.classList.remove('error');
    
    // Add new quote to the array
    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };
    
    quotes.push(newQuote);
    
    // Clear the input fields
    quoteTextInput.value = '';
    quoteCategoryInput.value = '';
    quoteTextInput.placeholder = 'Enter a new quote';
    quoteCategoryInput.placeholder = 'Enter quote category';
    
    // Update category filter to include new category if it's unique
    updateCategoryFilter();
    
    // Show success message with better styling
    showSuccessMessage('Quote added successfully!');
    
    // Display the newly added quote
    showRandomQuote();
    
    // Log the updated quotes array for debugging
    console.log('Updated quotes array:', quotes);
}

// Function to show success message with better styling
function showSuccessMessage(message) {
    // Create or update success message element
    let successMsg = document.getElementById('successMessage');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.id = 'successMessage';
        document.body.appendChild(successMsg);
    }
    
    successMsg.textContent = message;
    successMsg.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Create the add quote form (as required in Step 2)
    createAddQuoteForm();
    
    // Create category filter for displaying quotes by category
    createCategoryFilter();
    
    // Show initial random quote
    showRandomQuote();
    
    // Add event listener to the "Show New Quote" button
    const newQuoteButton = document.getElementById('newQuote');
    if (newQuoteButton) {
        newQuoteButton.addEventListener('click', showRandomQuote);
    }
});