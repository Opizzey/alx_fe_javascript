const quotes = [ 
    {text: "The best way to predict the future is to invent it.",
    category: "Innovation"},
    {text: "Life is 10% what happens to us and 90% how we react to it.",
    category: "Attitude"},
    {text: "The only way to do great work is to love what you do.",
    category: "Passion"}
];

// Web Storage Functions
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes.length = 0; // Clear the existing array
        quotes.push(...JSON.parse(savedQuotes));
    }
}

// Session Storage for last viewed quote
function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

function getLastViewedQuote() {
    const lastViewed = sessionStorage.getItem('lastViewedQuote');
    return lastViewed ? JSON.parse(lastViewed) : null;
}

// Category Filter Storage Functions
function saveLastSelectedFilter(category) {
    localStorage.setItem('lastSelectedFilter', category);
}

function getLastSelectedFilter() {
    return localStorage.getItem('lastSelectedFilter') || 'all';
}

// Function to populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    // Get unique categories from quotes array
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add categories to dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Restore last selected filter
    const lastFilter = getLastSelectedFilter();
    categoryFilter.value = lastFilter;
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    
    // Save the selected filter to localStorage
    saveLastSelectedFilter(selectedCategory);
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (selectedCategory === 'all') {
        // Show random quote from all categories
        showRandomQuote();
    } else {
        // Filter quotes by category
        const filteredQuotes = quotes.filter(quote => 
            quote.category.toLowerCase() === selectedCategory.toLowerCase()
        );
        
        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = '';
            const noQuotesMsg = document.createElement('p');
            noQuotesMsg.textContent = `No quotes found in category: `;
            
            const categoryStrong = document.createElement('strong');
            categoryStrong.textContent = selectedCategory;
            noQuotesMsg.appendChild(categoryStrong);
            
            quoteDisplay.appendChild(noQuotesMsg);
            return;
        }
        
        // Show random quote from filtered category
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
        
        // Save the last viewed quote to session storage
        saveLastViewedQuote(randomQuote);
    }
}

// JSON Export Function
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const exportAnchor = document.createElement('a');
    exportAnchor.href = url;
    exportAnchor.download = 'quotes.json';
    exportAnchor.click();
    
    URL.revokeObjectURL(url);
    showSuccessMessage('Quotes exported successfully!');
}

// JSON Import Function
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            
            // Validate imported data
            if (Array.isArray(importedQuotes)) {
                // Validate each quote has required properties
                const validQuotes = importedQuotes.filter(quote => 
                    quote.text && quote.category && 
                    typeof quote.text === 'string' && 
                    typeof quote.category === 'string'
                );
                
                if (validQuotes.length > 0) {
                    // Add imported quotes to existing array
                    quotes.push(...validQuotes);
                    
                    // Save to local storage
                    saveQuotes();
                    
                    // Update category filter
                    populateCategories();
                    
                    // Show success message
                    showSuccessMessage(`${validQuotes.length} quotes imported successfully!`);
                    
                    // Display a random quote to show the import worked
                    showRandomQuote();
                    
                    if (validQuotes.length < importedQuotes.length) {
                        showErrorMessage(`${importedQuotes.length - validQuotes.length} invalid quotes were skipped.`);
                    }
                } else {
                    showErrorMessage('No valid quotes found in the file. Each quote must have "text" and "category" properties.');
                }
            } else {
                showErrorMessage('Invalid JSON format. Please ensure the file contains an array of quotes.');
            }
        } catch (error) {
            showErrorMessage('Error reading file. Please ensure it is a valid JSON file.');
        }
    };
    
    fileReader.onerror = function() {
        showErrorMessage('Error reading the selected file.');
    };
    
    fileReader.readAsText(event.target.files[0]);
}

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
    
    // Save the last viewed quote to session storage
    saveLastViewedQuote(randomQuote);
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
    
    // Save to local storage
    saveQuotes();
    
    // Clear the input fields
    quoteTextInput.value = '';
    quoteCategoryInput.value = '';
    quoteTextInput.placeholder = 'Enter a new quote';
    quoteCategoryInput.placeholder = 'Enter quote category';
    
    // Update category filter to include new category if it's unique
    populateCategories();
    
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

// Function to show error message
function showErrorMessage(message) {
    // Create or update error message element
    let errorMsg = document.getElementById('errorMessage');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.id = 'errorMessage';
        errorMsg.className = 'error-message';
        document.body.appendChild(errorMsg);
    }
    
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    
    // Auto-hide after 4 seconds (longer for errors)
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 4000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load quotes from local storage first
    loadQuotes();
    
    // Populate categories dropdown
    populateCategories();
    
    // Create the add quote form (as required in Step 2)
    createAddQuoteForm();
    
    // Set up import/export functionality
    const exportButton = document.getElementById('exportQuotes');
    if (exportButton) {
        exportButton.addEventListener('click', exportToJsonFile);
    }
    
    const importInput = document.getElementById('importFile');
    if (importInput) {
        importInput.addEventListener('change', importFromJsonFile);
    }
    
    // Check if we should restore a specific filter or show last viewed quote
    const lastFilter = getLastSelectedFilter();
    const lastViewed = getLastViewedQuote();
    
    if (lastFilter !== 'all') {
        // Apply the last selected filter
        filterQuotes();
    } else if (lastViewed && quotes.some(q => q.text === lastViewed.text && q.category === lastViewed.category)) {
        // Display last viewed quote if it still exists and no filter is applied
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = '';
        
        const blockquote = document.createElement('blockquote');
        const quoteParagraph = document.createElement('p');
        quoteParagraph.textContent = `"${lastViewed.text}"`;
        blockquote.appendChild(quoteParagraph);
        
        const footer = document.createElement('footer');
        footer.textContent = 'Category: ';
        const categoryStrong = document.createElement('strong');
        categoryStrong.textContent = lastViewed.category;
        footer.appendChild(categoryStrong);
        
        blockquote.appendChild(footer);
        quoteDisplay.appendChild(blockquote);
        
        // Add indicator that this is the last viewed quote
        const lastViewedIndicator = document.createElement('small');
        lastViewedIndicator.textContent = '(Last viewed quote)';
        lastViewedIndicator.className = 'last-viewed-indicator';
        quoteDisplay.appendChild(lastViewedIndicator);
    } else {
        showRandomQuote();
    }
    
    // Add event listener to the "Show New Quote" button
    const newQuoteButton = document.getElementById('newQuote');
    if (newQuoteButton) {
        newQuoteButton.addEventListener('click', function() {
            // Reset filter to "All Categories" when showing new quote
            document.getElementById('categoryFilter').value = 'all';
            saveLastSelectedFilter('all');
            showRandomQuote();
        });
    }
});