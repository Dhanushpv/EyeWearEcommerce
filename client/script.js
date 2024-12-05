
function signUP() {
    window.location.href = 'signUP.html';
}

function login() {
    window.location.href = 'login.html';
}

async function usertypeSelection() {

    let response = await fetch('/users', {
        method: 'GET'
    });
    let prased_data = await response.json();
    console.log("prased_data", prased_data)

    let data = prased_data.data
    console.log("data", data);


    let selectusertype = document.getElementById('selection_container');

    let rows = '<option selected = "Select Your Type" disabled>Select Your Type</option>'

    for (let i = 0; i < data.length; i++) {

        rows += `
              <option value="${data[i].usertype}">${data[i].usertype}</option>
    
            `
    }


    selectusertype.innerHTML = rows

}

async function Addpage() {
    try {
        // First fetch to get categories
        let response = await fetch('/fetchCategory', {
            method: 'GET'
        });
        let parsed_data = await response.json();
        console.log("parsed_data", parsed_data);

        let data = parsed_data.data;
        console.log("data", data);

        let selection_Categories = document.getElementById('selection_Categories');
        let rows = '<option selected disabled>Select Categories</option>';

        for (let i = 0; i < data.length; i++) {
            rows += `
                <option value="${data[i].category}">${data[i].category}</option>
            `;
        }

        selection_Categories.innerHTML = rows;

        // Second fetch to get additional data (e.g., subcategories or related information)
        let additionalResponse = await fetch('/fetchGender', {
            method: 'GET'
        });
        let additionalData = await additionalResponse.json();
        console.log("additionalData", additionalData);

        let genderChoice = additionalData.data; // Assuming the structure is similar
        let selection_Subcategories = document.getElementById('selection_Gender');
        let subcategoryRows = '<option selected disabled>Select Gender</option>';

        for (let i = 0; i < genderChoice.length; i++) {
            subcategoryRows += `
                <option value="${genderChoice[i].gender}">${genderChoice[i].gender}</option>
            `;
        }

        selection_Subcategories.innerHTML = subcategoryRows;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function AddUser(event) {
    event.preventDefault();
    console.log("reacheed.......");

    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let phoneno = document.getElementById('phoneno').value
    let usertype = document.getElementById('selection_container').value

    //validation


    if (!name) {
        alert('Name is required');
        return;
    }
    if (!email || !validateEmail(email)) {
        alert('Valid email is required');
        return;
    }
    function validateEmail(email) {
        let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    if (!password || password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    // Phone number validation function (basic check for digits and length)
    function validatePhone(phone) {
        let re = /^\d{10}$/; // Assumes 10-digit phone number format
        return re.test(phone);
    }
    if (!phoneno || !validatePhone(phoneno)) {
        alert('Please enter a valid phone number');
        return;
    }


    if (!usertype) {
        alert('User type must be selected');
        return;
    }



    data = {
        name,
        email,
        password,
        phoneno,
        usertype
    }

    console.log("data", data)

    let strdata = JSON.stringify(data);
    console.log("strdata", strdata);

    try {
        let response = await fetch('/user', {
            method: 'POST',
            headers: {
                "Content-Type": "Application/json",

            },
            body: strdata,

        });
        console.log("response", response);
        let parsed_Response = await response.json()
        if (response.status === 200) {
            alert(' User successfully created');
            window.location = `login.html`
        } else {
            alert(parsed_Response.message)
        }

    } catch (error) {


    }

}

function logout() {
    console.log("Reached....at log out");

    let params = new URLSearchParams(window.location.search);
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    // Remove login-related data from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    console.log("token", token);

    // If the token exists, remove it and redirect to the index page
    if (token) {
        localStorage.removeItem(token_key);
        window.location.href = "index.html";
    } else {
        console.log("No token found");
    }

    // Update login section in the UI
    document.getElementById('loginSection').innerHTML = `
        <span onclick="signUP()">SIGN IN</span> 
        / <span onclick="login()">LOGIN</span>
    `;

    // Display success alert
    alert('Logged out successfully');

    // Check if the user is a buyer, show alert and redirect
    if (localStorage.getItem('userType') === 'buyer') {
        alert('You have been logged out. You need to log in again to access the buyer page.');
        window.location.href = 'login.html'; // Redirect to the login page
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const loginSection = document.querySelector('.loginSection');

    if (!loginSection) {
        console.error("Error: loginSection element not found in the DOM.");
        return;
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');

    if (isLoggedIn) {
        if (userType === 'Buyer' || userType === 'Seller') {
            loginSection.innerHTML = `
               <!-- <span>${userType}</span>--!>
                <button id="logoutButton" style="margin-left: 10px;">Logout</button>
            `;

            document.getElementById('logoutButton').addEventListener('click', function () {
                logout();
            });
        } else {
            console.error("Error: Unknown user type.");
            loginSection.innerHTML = `
                <span onclick="signUP()">SIGN IN</span>
                / <span onclick="login()">LOGIN</span>
            `;
        }
    } else {
        loginSection.innerHTML = `
            <span onclick="signUP()">SIGN IN</span>
            / <span onclick="login()">LOGIN</span>
        `;
    }
});

async function userLogin(event) {
    event.preventDefault();  // Prevent form submission

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let data = { email, password };
    let strData = JSON.stringify(data);

    try {
        let response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: strData
        });

        let parsed_Response = await response.json();
        let token_data = parsed_Response.data;
        let usertype = token_data.user_type.usertype;
        let token = token_data.token;
        let id = token_data.id;
        let token_key = id;

        // Store data in localStorage
        localStorage.setItem(token_key, token);
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userType', usertype);

        // Update loginSection
        const loginSection = document.getElementById('loginSection');
        if (loginSection) {
            loginSection.innerHTML = `
                <span class="user-icon">
                    <img src="./images/user-icon.png" alt="User Icon" style="width: 30px; height: 30px;">
                </span>
                <span>${usertype}</span>
                <button id="logoutButton" style="margin-left: 10px;">Logout</button>
            `;

            // Add event listener to the logout button
            document.getElementById('logoutButton').addEventListener('click', function () {
                logout();
            });
        }

        // Redirect based on user type
        if (usertype === "Admin") {
            alert("Admin logged in successfully");
            window.location.href = `Admin.html?login=${token_key}&id=${id}`;
        } else if (usertype === "Buyer") {
            alert("Buyer logged in successfully");
            window.location.href = `index.html?login=${token_key}&id=${id}`;
        } else if (usertype === "Seller") {
            alert("Seller logged in successfully");
            window.location.href = `Seller.html?login=${token_key}&id=${id}`;
        } else {
            alert("Unknown user type");
        }
    } catch (error) {
        console.log("Error during login:", error);
    }
}

async function buyerSection() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);
    try {
        const response = await fetch(`/individualUser/${id}`, {
            headers: {
                "Authorization": token, // Send the token in the Authorization header
            },
        });
        console.log(response)

        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }

        const user = await response.json();
        console.log("user", user)

        let data = user.data;
        console.log("data", data);

        let userId = data._id;
        console.log("userId a s d :", userId);

        // Display user details
        document.querySelector(".buyerProfile").innerHTML = `

            <div class="text-center dropdown">
                <button class="dropbtn" aria-haspopup="true" role="button">
                    <span class="text-break"><strong>Hello,</strong> ${data.name}</span><br>
                    <span><strong>Account & Lists</strong></span>
                </button>
                <div class="dropdown-content pt-3" role="menu" style="text-align: left;">
                    
                    <span onClick="Your_Account()" class="dropdown-item  pt-3" tabindex="0">Your Account</span>
                    <span class="dropdown-item  pt-3" tabindex="0">Your Orders</span>
                    <span onClick="WishListPageClick()" class="dropdown-item  pt-3" tabindex="0">Your Wish List</span>
                    <span onClick="Memberships()" class="dropdown-item  pt-3 pb-3" tabindex="0">Memberships & Subscriptions</span>
                </div>
            </div>

            
        `;

        let responseofProductList = await fetch('/fullProductList', {
            method: 'GET'
        });
        let parsed_data = await responseofProductList.json();
        console.log("ProductList", parsed_data);

        let dataofProductList = parsed_data.data;
        console.log("dataofProductList", dataofProductList);



        let getAllprducts = document.getElementById("buyerproductListContainer");

        // Generate rows using map
        let rows = dataofProductList.map((product, index) => {
            // Get the first image URL and alt text
            let firstImageUrl = product.images[3]?.url.replace(/\\/g, '/'); // Replace `\` with `/` for correct URL formatting
            let firstImageAlt = product.images[0]?.alt || "Product Image";
            let productId = product._id;
            console.log("productId : ", productId)

            return ` 
                <ul class="cards">
                    
                    
                    
                    <li>
                        <div class="card " >
                            <div class="card__image relative h-32 w-32 " 
                                    style="background-image: url(${firstImageUrl}); 
                                            background-position: center; 
                                            background-repeat: no-repeat; 
                                            background-size: cover;
                                            width : 100%;
                                            height : 80vh"
                                    title="${firstImageAlt}" ">
                                    <div class="  absolute top-0 right-0 h-16 w-16  px-3 pt-3 " onClick=wishList('${product._id}')>
                                        <label class="ui-like p-2 ">
                                            <input type="checkbox">
                                            <div class="like">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill=""><g stroke-width="100" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"><path d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z"></path></g></svg>
                                            </div>
                                        </label>
                                    
                                    </div>
                            </div>
                            <div class="card__overlay " >
                            <div class="card__header d-flex justify-content-between aling-items-center">
                                <svg class="card__arc" ><path /></svg>                 
                            
                                <div class="card__header-text">
                                    
                                    <div class=" ">
                                    <h3 class="card__title " onClick="Product_Detail_View('${product._id}')">${product.title}</h3>
                                    <div class="card__status fs-5 " onClick="Product_Detail_View('${product._id}')">₹${product.price}</div>
                                    </div>
                                    
                                </div>  
                                <div>
                                <button type="button" class="btn btn-primary" onClick="CartClick('${product._id}',${product.price})">Add to Cart</button>
                                </div>
                            </div>
                            <p class="card__description" onClick="Product_Detail_View('${product._id}')">${product.description.slice(0, 200) + "..."}</p>
                            </div>
                        </div>
                    </li>    
                </ul>
            `;
        }).join('');

        // Update the inner HTML with the new rows
        getAllprducts.innerHTML = rows;


    } catch (error) {
        console.error("Error fetching user details:", error);
        document.getElementById("user-details").innerHTML =
            "<p>Unable to load user details. Please try again later.</p>";
    }

}

async function fetchUserDetails() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);
    try {
        const response = await fetch(`/individualUser/${id}`, {
            headers: {
                "Authorization": token, // Send the token in the Authorization header
            },
        });
        console.log(response)

        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }

        const user = await response.json();
        console.log("user", user)

        let data = user.data;
        console.log("data", data);

        let userId = data._id;
        console.log("userId a s d :", userId);

        // Display user details
        document.querySelector(".profile").innerHTML = `

            <div class="text-center dropdown">
                <button class="dropbtn" aria-haspopup="true" role="button">
                    <span class="text-break"><strong>Hello,</strong> ${data.name}</span><br>
                    <span><strong>Account & Lists</strong></span>
                </button>
                <div class="dropdown-content pt-3" role="menu" style="text-align: left;">
                    
                    <span onClick="Your_Account()" class="dropdown-item  pt-3" tabindex="0">Your Account</span>
                    <span class="dropdown-item  pt-3" tabindex="0">Your Orders</span>
                    <span onClick="WishListPageClick()" class="dropdown-item  pt-3" tabindex="0">Your Wish List</span>
                    <span class="dropdown-item  pt-3" tabindex="0">Your Seller Account</span>
                    <span onClick="Memberships()" class="dropdown-item  pt-3 pb-3" tabindex="0">Memberships & Subscriptions</span>
                </div>
            </div>

            
        `;

        let responseofProductList = await fetch('/fullProductList', {
            method: 'GET'
        });
        let parsed_data = await responseofProductList.json();
        console.log("ProductList", parsed_data);

        let dataofProductList = parsed_data.data;
        console.log("dataofProductList", dataofProductList);



        let getAllprducts = document.getElementById("productListContainer");

        // Generate rows using map
        let rows = dataofProductList.map((product, index) => {
            // Get the first image URL and alt text
            let firstImageUrl = product.images[3]?.url.replace(/\\/g, '/'); // Replace `\` with `/` for correct URL formatting
            let firstImageAlt = product.images[0]?.alt || "Product Image";
            let productId = product._id;
            console.log("productId : ", productId)

            return ` 
                <ul class="cards">
                    
                    
                    
                    <li>
                        <div class="card " >
                            <div class="card__image relative h-32 w-32 " 
                                    style="background-image: url(${firstImageUrl}); 
                                            background-position: center; 
                                            background-repeat: no-repeat; 
                                            background-size: cover;
                                            width : 100%;
                                            height : 80vh"
                                    title="${firstImageAlt}" ">
                                    <div class="  absolute top-0 right-0 h-16 w-16  px-3 pt-3 " onClick=wishList('${product._id}')>
                                        <label class="ui-like p-2 ">
                                            <input type="checkbox">
                                            <div class="like">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill=""><g stroke-width="100" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"><path d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z"></path></g></svg>
                                            </div>
                                        </label>
                                    
                                    </div>
                            </div>
                            <div class="card__overlay " >
                            <div class="card__header d-flex justify-content-between aling-items-center">
                                <svg class="card__arc" ><path /></svg>                 
                            
                                <div class="card__header-text">
                                    
                                    <div class=" ">
                                    <h3 class="card__title " onClick="Product_Detail_View('${product._id}')">${product.title}</h3>
                                    <div class="card__status fs-5 " onClick="Product_Detail_View('${product._id}')">₹${product.price}</div>
                                    </div>
                                    
                                </div>  
                                <div>
                                <button type="button" class="btn btn-primary" onClick="CartClick('${product._id}',${product.price})">Add to Cart</button>
                                </div>
                            </div>
                            <p class="card__description" onClick="Product_Detail_View('${product._id}')">${product.description.slice(0, 200) + "..."}</p>
                            </div>
                        </div>
                    </li>    
                </ul>
            `;
        }).join('');

        // Update the inner HTML with the new rows
        getAllprducts.innerHTML = rows;


    } catch (error) {
        console.error("Error fetching user details:", error);
        document.getElementById("user-details").innerHTML =
            "<p>Unable to load user details. Please try again later.</p>";
    }

}

function AddPageClick() {

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log(token)
    console.log(id)

    window.location.href = `addPage.html?login=${token}&id=${id}`;

}

async function AddProducts(event) {
    event.preventDefault();

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);


    let title = document.getElementById('title').value.trim();
    let description = document.getElementById('description').value.trim();
    let price = document.getElementById('price').value.trim();
    let category = document.getElementById('selection_Categories').value.trim();
    let gender = document.getElementById('selection_Gender').value.trim();
    let brand = document.getElementById('brand').value.trim();
    let stock = document.getElementById('stock').value.trim();
    let rating = document.getElementById('rating').value.trim();
    let images = document.getElementById('image');

    if (!title || !description || !price || !category || !gender || !brand || !stock || !rating) {
        alert("All fields are required. Please fill out the form completely.");
        return;
    }

    if (images.files && images.files.length > 0) {
        let formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('gender', gender);
        formData.append('brand', brand);
        formData.append('stock', stock);
        formData.append('rating', rating);

        for (let file of images.files) {
            formData.append('images', file);
        }

        try {
            let response = await fetch('/uploadProducts', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 200) {
                alert('The product has been added successfully.');
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            alert('An error occurred while adding the product. Please try again later.');
        }
    } else {
        alert("Please upload at least one image for the product.");
    }
}

function Your_Account() {

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log(token)
    console.log(id)

    window.location.href = `userAcount.html?login=${token_key}&id=${id}`

}

async function AccountSection() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log('Token:', token);
    console.log('User ID:', id);

    let userRole;

    try {
        // Fetch user role from API
        const response = await fetch(`/individualUser/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log("response",response);

        let parsed_data = await response.json();
        console.log("parsed_data account",parsed_data);



    } catch (error) {
        console.error('Error fetching user role:', error);
        alert('Unable to determine user role. Please log in again.');
        return;
    }

    // Update the dashboard dynamically based on the user role
    const dashboardContainer = document.getElementById("dashboard");
    const addProductSection = document.getElementById("addProductSection");

    if (userRole === "seller") {
        dashboardContainer.innerHTML = `
            <div class="p-10 md:px-7 xl:px-10 rounded-[20px] bg-white shadow-md hover:shadow-lg mb-8">
                <div class="w-[70px] h-[70px] flex items-center justify-center rounded-2xl mb-8">
                    <img src="https://img.icons8.com/?size=100&id=88300&format=png&color=000000" alt="Seller Dashboard">
                </div>
                <h4 class="font-semibold text-xl text-dark mb-3">Seller Dashboard</h4>
                <p class="text-body-color">Manage sales, track performance effortlessly.</p>
            </div>`;
        // Show "Add Product" section for sellers
        console.log("Showing Add Product Section for Seller");
        addProductSection.classList.remove('hidden');
    } else if (userRole === "buyer") {
        dashboardContainer.innerHTML = `
            <div class="p-10 md:px-7 xl:px-10 rounded-[20px] bg-white shadow-md hover:shadow-lg mb-8">
                <div class="w-[70px] h-[70px] flex items-center justify-center rounded-2xl mb-8">
                    <img src="https://img.icons8.com/?size=100&id=56426&format=png&color=000000" alt="Buyer Dashboard">
                </div>
                <h4 class="font-semibold text-xl text-dark mb-3">Buyer Dashboard</h4>
                <p class="text-body-color">Track, return, or buy things again.</p>
            </div>`;
        // Hide "Add Product" section for buyers
        console.log("Hiding Add Product Section for Buyer");
        addProductSection.classList.add('hidden');
    } else {
        dashboardContainer.innerHTML = `
            <div class="p-10 md:px-7 xl:px-10 rounded-[20px] bg-white shadow-md hover:shadow-lg mb-8">
                <h4 class="font-semibold text-xl text-dark mb-3">Unauthorized</h4>
                <p class="text-body-color">You are not authorized to access this section.</p>
            </div>`;
        // Hide "Add Product" section for unauthorized users
        console.log("Hiding Add Product Section for Unauthorized User");
        addProductSection.classList.add('hidden');
    }
}

async function Product_Detail_View(id) {
    console.log("reached single view", id)


    let params = new URLSearchParams(window.location.search);

    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log(token)
    console.log(id)

    window.location.href = `singleView.html?login=${token_key}&id=${id}`

}

async function SingleView() {
    console.log("Reached...");

    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    try {
        let response = await fetch(`/individualUser/${id}`,{

            headers: {
                "Authorization": token, // Send the token in the Authorization header
            },

        });
        console.log("individualUser",response);

        
        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }

        const user = await response.json();
        console.log("user", user)

        
    } catch (error) {
        console.log(error)
    }

       
        try {
        
        let responseofProductList = await fetch(`/SingleProductList/${id}`, {
            method: 'GET'
        });
        // console.log("responseofProductList@@@@@",responseofProductList)
        let parsed_data = await responseofProductList.json();
        console.log("ProductList:", parsed_data);

        let dataofProductList = parsed_data.data;
        console.log("dataofProductList:", dataofProductList);
        let images = dataofProductList?.images; // Get images from the response
        console.log("Images:", images);

        let getAllprducts = document.getElementById("SingleProductView");
        let productDetails = document.getElementById("productDetails")
        console.log("productDetails", productDetails)
        let expandedImg = document.getElementById("expandedImg");
        let imgText = document.getElementById("imgtext");

        // Ensure images is an array
        if (Array.isArray(images)) {
            // Populate the expanded container with the first image on load
            if (images[0]?.url) {
                expandedImg.src = images[0].url.replace(/\\/g, '/');
                // imgText.innerHTML = images[0].alt || "Product Image";
            }

            let rows = images.map((image, index) => {
                if (image?.url) { // Check if image has a URL
                    let firstImageUrl = image.url.replace(/\\/g, '/');
                    // let firstImageAlt = image.alt || `Product Image ${index + 1}`;

                    return `
                    <div class="flex">
                        <div class="row">
                            <div class="column">
                                <img src="${firstImageUrl}" 
                                     
                                     onclick="myFunction(this);" 
                                     onmouseover="hoverImage(this);">
                            </div>
                        </div>
                    </div>`;
                } else {
                    console.error(`Missing URL in image at index ${index}:`, image);
                    return `<p>Image not available.</p>`;
                }
            }).join('');
            getAllprducts.innerHTML = rows;
        } else {
            console.error("Images is not an array:", images);
            getAllprducts.innerHTML = "<p>No images found for this product.</p>";
        }

        console.log("dataofProductList:", dataofProductList);

        if (Array.isArray(dataofProductList)) {
            let row = '';
            for (let i = 0; i < dataofProductList.length; i++) {
                row += `
                    <div>${dataofProductList[i].title}</div>
                `;
            }
            productDetails.innerHTML = row;
            console.log("Product titles displayed:", dataofProductList.map(product => product.title));
        } else if (typeof dataofProductList === 'object' && dataofProductList !== null) {
            // Handle the case where dataofProductList is a single object
            let row = `
                <div class="text-6xl font-semibold">${dataofProductList.title || "Title not available"}</div>
                <div class="pt-7  text-3xl">💲${dataofProductList.price} </div>
                 <div class=" pt-7 text-xl text-gray-500 font-semibold">${dataofProductList.brand}</div>
                <div class="w-full pt-5">${dataofProductList.description}</div>
                <div class=" pt-7 text-lg text-gray-500 font-semibold">⭐ /${dataofProductList.rating}</div>
                <div class=" pt-7 text-lg text-green-500 font-semibold underline underline-offset-8">Available offers</div>
                <div class=" pt-4 text-sm text-gray-500 font-semibold">🏷️Bank Offer5% Unlimited Cashback on Flipkart Axis Bank Credit CardT&C</div>
                <div class=" pt-2 text-sm text-gray-500 font-semibold">🏷️Bank Offer10% off up to ₹750 on HDFC Bank Credit Card EMI on 3 months tenure. Min. Txn Value: ₹7,500T&C</div>
                <div class=" pt-2 text-sm text-gray-500 font-semibold">🏷️Bank Offer10% off up to ₹1,000 on HDFC Bank Credit Card EMI on 9 months tenure. Min Txn Value: ₹7,500T&C</div>
                <div class=" pt-2 text-sm text-gray-500 font-semibold">🏷️Special PriceGet extra 30% off (price inclusive of cashback/coupon)T&C</div>
                <div class=" pt-2 text-sm text-green-500 font-semibold">  +8 more offers</div>
               <div class="pt-5">
                    <button class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition">
                        Add to Cart
                    </button>
                    <button class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition ml-2">
                        Buy Now
                    </button>
                </div>


            `;
            productDetails.innerHTML = row;
            console.log("Single product title displayed:", dataofProductList.title);
        } else {
            console.error("Unexpected data format:", dataofProductList);
            productDetails.innerHTML = "<p>No product details available.</p>";
        }




    } catch (error) {
        console.error("Error fetching product details:", error);
        document.getElementById("SingleProductView").innerHTML =
            "<p>Unable to load product details. Please try again later.</p>";
    }
}

function myFunction(imgs) {
    var expandImg = document.getElementById("expandedImg");
    var imgText = document.getElementById("imgtext");
    expandImg.src = imgs.src;
    imgText.innerHTML = imgs.alt;

    // Ensure the container is visible
    expandImg.parentElement.style.display = "block";
}

function hoverImage(imgs) {
    var expandImg = document.getElementById("expandedImg");
    var imgText = document.getElementById("imgtext");
    expandImg.src = imgs.src;
    imgText.innerHTML = imgs.alt;
}

function CartClick(productId, price) {



    let params = new URLSearchParams(window.location.search);

    let userId = params.get('id');
    let token_key = params.get('login');
    // let token = localStorage.getItem(token_key);


    console.log(`Product ID: ${productId}`);
    console.log(`User ID: ${userId}`);

    const quantity = 1;


    window.location.href = `AddtoCart.html?productid=${productId}&userid=${userId}&price=${price}&quantity=${quantity}`

}

async function CartLoad() {
    let params = new URLSearchParams(window.location.search);
    let productId = params.get('productid');
    let userId = params.get('userid');
    let price = parseFloat(params.get('price'));
    let quantity = parseInt(params.get('quantity'), 10);

    console.log(`Product ID: ${productId}`);
    console.log(`User ID: ${userId}`);
    console.log(`Price: ${price.toFixed(2)}`);
    console.log(`Quantity: ${quantity}`);

    // Basic validations
    if (!productId || !userId || isNaN(price) || isNaN(quantity) || quantity < 1) {
        alert("Invalid or missing product details.");
        return;
    }

    try {

        let cartFetchResponse = await fetch(`/CartView`, {
            method: 'GET',
        });
        console.log("cartFetchResponse", cartFetchResponse);

        let cartFetchResult = await cartFetchResponse.json();
        let existingCartItems = cartFetchResult.data || [];

        let existingProduct = existingCartItems.find(item => item.productId === productId);

        let data;
        if (existingProduct) {
            // Update the quantity of the existing product
            data = {
                productId,
                userId,
                price,
                quantity: existingProduct.quantity + quantity,
            };
        } else {
            // Add a new product to the cart
            data = { productId, userId, price, quantity };
        }

        // Fetch existing cart data from `/fullProductList`
        let productResponse = await fetch('/fullProductList', { method: 'GET' });
        if (!productResponse.ok) {
            throw new Error(`Failed to fetch product list: ${productResponse.status}`);
        }

        let productList = await productResponse.json();
        let products = productList.data;

        console.log("Product List:", products);


        // Add to cart API call
        let Cartresponse = await fetch('/addToCart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!Cartresponse.ok) {
            throw new Error(`Failed to add to cart: ${Cartresponse.status}`);
        }

        let result = await Cartresponse.json();
        console.log("API Result:", result);

        // Display updated cart items
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = ""; // Clear existing items
        let updatedCartItems = result.data.addCart.flatMap(cart => cart.items);
        updatedCartItems.forEach(item => {
            const productElement = document.createElement('div');
            productElement.className = 'cart-item';

            let imageUrl = '/path/to/placeholder-image.jpg';  // Default image in case no URL is found
            let product = null;

            for (let i = 0; i < products.length; i++) {
                if (products[i]._id === item.productId) {
                    product = products[i];
                    console.log("Found Product:", product);

                    // Check if the product has images and a valid URL
                    if (product?.images) {
                        console.log("Product Images:", product?.images); // Log the images structure

                        // Access the image URL based on the structure of `images`
                        if (Array.isArray(product.images)) {
                            // If images is an array of objects, use the first image URL
                            imageUrl = product?.images?.[3]?.url || imageUrl;
                        } else if (typeof product.images === 'object' && product.images.url) {
                            // If images is an object with a 'url' field
                            imageUrl = product.images.url || imageUrl;
                        }
                    }
                    break; // Exit loop once product is found
                }
            }

            console.log("Final Image URL:", imageUrl); // Log the final image URL

            productElement.innerHTML = `
  

	<div class="container mx-auto px-4 sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl ">

		<section id="cart"> 
			<article class="product">
				<header>
					<a class="remove">
						<img src="${imageUrl}">

					</a>
				</header>

				<div class="content">

					<h1>${product?.title}</h1>

					<h3>${product?.description.slice(0, 200) + ".."}</h3>

					
				</div>

				<footer class="content">
					<span class="qt-minus">-</span>
					<span class="qt">${item.quantity}</span>
					<span class="qt-plus">+</span>

					<h2 class="full-price">
						$${product?.price?.toFixed(2) || "N/A"}
					</h2>

				</footer>
			</article>
		</section>

	</div>

	
            `;

            const cartItemsContainer = document.getElementById('cart-items');
            cartItemsContainer.appendChild(productElement);
        });




    } catch (error) {
        console.error("Error loading cart:", error);
        alert("An error occurred. Please try again later.");
    }
}

let isRequestInProgress = false;

async function wishList(productId, title, price) {
    // Prevent multiple API calls
    if (isRequestInProgress) return;
    isRequestInProgress = true;

    try {
        // Log for debugging
        console.log("wishList function called with:", productId, title, price);

        // Extract user ID and token from the query parameters
        let params = new URLSearchParams(window.location.search);
        let userId = params.get('id');
        let token_key = params.get('login');

        // Make the API call
        const response = await fetch('/addtowishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId,
                title,
                price,
                userId,
            }),
        });

        // Parse the response
        const data = await response.json();

        // Handle errors
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add to wishlist');
        }

        // Success feedback
        alert('Item successfully added to the wishlist!');
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Error adding item to wishlist');
    } finally {
        isRequestInProgress = false;
    }
}

async function AddressPageClick() {

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log(token)
    console.log(id)

    window.location.href = `addAddress.html?login=${token_key}&id=${id}`;



}

async function Addressaddpage() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    let token_key = params.get('login');

    const addAddressBlock = document.querySelector('.box-content');
    const addAddressContainer = document.getElementById('addAddress');

    if (addAddressContainer.style.display === 'none' || addAddressContainer.innerHTML === '') {
        addAddressBlock.style.display = 'none';

        // Use template literals to inject `id` dynamically into the onSubmit function
        const formHTML = `
        <div class="container mx-auto w-6/12 relative">
          <button class="absolute top-0 right-0 m-3 text-lg font-bold" onclick="hideForm()" aria-label="Close">&times;</button>
          <h2 class="text-center mb-4">Add New Address</h2>
          <form class="p-4 border rounded bg-gray-200 shadow-sm" onSubmit="addAddress('${id}'); return false;">
            <div class="mb-3">
              <label for="firstName" class="form-label">Full Name</label>
              <input type="text" class="form-control" id="firstName" placeholder="Enter your full name" required>
            </div>
            <div class="mb-3">
              <label for="flatDetails" class="form-label">Flat Details</label>
              <input type="text" class="form-control" id="flatDetails" placeholder="Flat Details" required>
            </div>
            <div class="mb-3">
              <label for="streetDetails" class="form-label">Street Details</label>
              <input type="text" class="form-control" id="streetDetails" placeholder="Street Details" required>
            </div>
            <div class="mb-3">
              <label for="landmark" class="form-label">Landmark</label>
              <input type="text" class="form-control" id="landmark" placeholder="Landmark" required>
            </div>
            <div class="mb-3">
              <label for="city" class="form-label">City</label>
              <input type="text" class="form-control" id="city" placeholder="City" required>
            </div>
            <div class="mb-3">
              <label for="pincode" class="form-label">Pincode</label>
              <input type="text" class="form-control" id="pincode" placeholder="Pincode" required>
            </div>
            <div class="mb-3">
              <label for="state" class="form-label">State</label>
              <input type="text" class="form-control" id="state" placeholder="State" required>
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-md">Add Address</button>
          </form>
        </div>`;

        addAddressContainer.innerHTML = formHTML;
        addAddressContainer.style.display = 'block';
    }
}

function hideForm() {
    const addAddressBlock = document.querySelector('.box-content');
    const addAddressContainer = document.getElementById('addAddress');
    addAddressContainer.style.display = 'none';
    addAddressBlock.style.display = 'block';
}

async function addAddress() {


    let params = new URLSearchParams(window.location.search);
    let id = params.get('id'); // Get the user ID
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);
    console.log("token", token)

    if (!id) {
        alert("User ID is missing!");
        return;
    }

    try {
        let firstName = document.getElementById('firstName').value;
        let flatDetails = document.getElementById('flatDetails').value;
        let streetDetails = document.getElementById('streetDetails').value;
        let landmark = document.getElementById('landmark').value;
        let city = document.getElementById('city').value;
        let pincode = document.getElementById('pincode').value;
        let state = document.getElementById('state').value;

        let data = {

            firstName,
            flatDetails,
            streetDetails,
            landmark,
            city,
            pincode,
            state
        };

        console.log("Data to send:", data);

        let response = await fetch(`/addAddress/${id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include token if needed
            },
            body: JSON.stringify(data),
        });

        let parsed_Response = await response.json();

        if (response.ok) {
            alert('Address successfully added');
            hideForm(); // Hide the form on success
        } else {
            alert(parsed_Response.message || "Failed to add address");
        }
    } catch (error) {
        console.error("Error adding address:", error);
        alert("An error occurred while adding the address.");
    }
}

async function addressLoad(event) {
    // Prevent default behavior (if triggered by a form or similar event)
    if (event) event.preventDefault();

    // Get URL parameters and token
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    // Fetch address data from the API
    try {
        let AddressFetch = await fetch(`/addAddressLoad/${id}`, {
            method: 'GET',
            headers: {
                "Authorization": token,
            },
        });

        // Parse response
        const parsed_data = await AddressFetch.json();
        console.log("Parsed Data:", parsed_data);

        let data = parsed_data.data;

        // Check if the target element exists
        let loadAddresspage = document.getElementById('loadAddresspage');
        if (!loadAddresspage) {
            console.error('Element with ID "loadAddresspage" not found.');
            return;
        }

        // Generate HTML for address cards
        let rows = '';
        for (let i = 0; i < data.length; i++) {
            rows += `
                
                <div class="px-10 pt-10 ">
                    <div class=" bg-white box-content border-dashed h-52 w-52 p-4 border-3  rounded-lg border-neutral-700  ">
                    <div class="text-base text-cyan-400 text-nowrap text-center bg-cyan-700 ">${data[i].firstName}</div>
                    <div class="text-base text-zinc-800 text-nowrap text-left  pt-2">FlatDetails : ${data[i].flatDetails}</div>
                    <div class="text-base text-zinc-800 text-nowrap text-left  pt-2">Landmark : ${data[i].landmark}</div>
                    <div class="text-base text-zinc-800 text-nowrap text-left  pt-2">City : ${data[i].city}</div>
                    <div class="text-base text-zinc-800 text-nowrap text-left  pt-2">State : ${data[i].state}</div>
                    <div class="text-base text-zinc-800 text-nowrap text-left  pt-2">Pincode : ${data[i].pincode}</div>

                    </div>
                </div>
            `;
        }

        // Add content to the target element
        loadAddresspage.innerHTML = rows;

    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', (event) => {
    addressLoad(event);
});

async function PaymentPageClick() {

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log(token)
    console.log(id)

    window.location.href = `payment.html?login=${token_key}&id=${id}`;

}

async function ContactPageClick() {

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log(token)
    console.log(id)

    window.location.href = `Contact.html?login=${token_key}&id=${id}`;

}

async function Memberships() {

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log(token)
    console.log(id)

    window.location.href = `Memberships.html?login=${token_key}&id=${id}`;


}

async function WishListPageClick() {

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log(token)
    console.log(id)

    window.location.href = `wishList.html?login=${token_key}&id=${id}`;


}

async function WishList() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    try {
        // Fetch data
        let wishlistResponse = await fetch(`/loadWishList/${id}`, {
            method: 'GET',
            headers: {
                "Authorization": token,
            },
        });

        if (!wishlistResponse.ok) {
            throw new Error(`HTTP error! status: ${wishlistResponse.status}`);
        }

        // Parse response
        const parsed_data = await wishlistResponse.json();
        console.log("Parsed Data:", parsed_data);

        let data = parsed_data.data;
        if (!data || data.length === 0) {
            console.warn("No items found in the wishlist.");
            document.getElementById('WishListCard').innerHTML = "<p class='text-center text-gray-500'>No items found in your wishlist.</p>";
            return;
        }

        // Generate cards
        let WishListCard = document.getElementById('WishListCard');
        let rows = '';

        for (let i = 0; i < data.length; i++) {
            rows += `
                <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-6">
                    <div class="relative flex flex-col rounded-xl bg-white shadow-md">
                        <div class="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600">
                            <img src ="$">
                        </div>
                        <div class="p-6">
                            <h5 class="mb-2 text-xl font-semibold text-gray-900">
                                ${data[i].title || 'No Title'}
                            </h5>
                            <p class="text-base font-light text-gray-700">
                                Price: ${data[i].price || 'No Price'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }

        WishListCard.innerHTML = rows;

    } catch (error) {
        console.error("Error fetching wishlist:", error);
        document.getElementById('WishListCard').innerHTML = "<p class='text-center text-red-500'>Failed to load wishlist. Please try again later.</p>";
    }
}


const imageInput = document.getElementById("image");
const uploadMessage = document.getElementById("upload-message");
const svgIcon = document.querySelector(".header svg"); // Select the SVG icon

imageInput.addEventListener("change", (event) => {
    // Remove the SVG icon when an image is uploaded
    if (svgIcon) {
        svgIcon.remove();
    }

    // Clear the current content of the message
    uploadMessage.innerHTML = "";

    // Get the selected files
    const files = event.target.files;

    // Loop through each file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Ensure the file is an image
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            // When the file is loaded, create an img element with a remove button
            reader.onload = (e) => {
                // Container for the image and button
                const imageContainer = document.createElement("div");
                imageContainer.style.position = "relative";
                imageContainer.style.display = "inline-block";
                imageContainer.style.margin = "5px";

                // Create the image
                const img = document.createElement("img");
                img.src = e.target.result;
                img.style.width = "200px";
                img.style.height = "200px";
                img.style.objectFit = "contain";
                img.style.border = "1px solid black";

                img.alt = file.name;

                // Create the remove button
                const removeButton = document.createElement("button");
                removeButton.textContent = "✖";
                removeButton.style.position = "absolute";
                removeButton.style.top = "0";
                removeButton.style.right = "0";
                removeButton.style.backgroundColor = "red";
                removeButton.style.color = "white";
                removeButton.style.border = "none";
                removeButton.style.borderRadius = "50%";
                removeButton.style.cursor = "pointer";
                removeButton.style.width = "20px";
                removeButton.style.height = "20px";
                removeButton.style.display = "flex";
                removeButton.style.justifyContent = "center";
                removeButton.style.alignItems = "center";

                // Add click event to remove the image
                removeButton.addEventListener("click", () => {
                    imageContainer.remove();
                });

                // Append the image and button to the container
                imageContainer.appendChild(img);
                imageContainer.appendChild(removeButton);

                // Append the container to the upload message
                uploadMessage.appendChild(imageContainer);
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
        }
    }
});

// addProduct file input type section END.......


//add to cart


function getImageUrl(product) {
    if (product?.images) {
        if (Array.isArray(product.images)) {
            return product?.images?.[0]?.url || '/path/to/placeholder-image.jpg';
        } else if (typeof product.images === 'object') {
            return product.images.url || '/path/to/placeholder-image.jpg';
        }
    }
    return '/path/to/placeholder-image.jpg';
}

function updateCartTotals(subtotal) {
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + tax + SHIPPING_CHARGE) * 100) / 100;

    document.querySelector('.subtotal span').textContent = subtotal.toFixed(2);
    document.querySelector('.tax span').textContent = tax.toFixed(2);
    document.querySelector('.shipping span').textContent = SHIPPING_CHARGE.toFixed(2);
    document.querySelector('.total span').textContent = total.toFixed(2);
}

// jQuery for interactivity
$(document).ready(function () {
    $(".remove").click(function () {
        $(this).closest('.product').remove();
        changeTotal();
    });

    $(".qt-plus").click(function () {
        const qt = $(this).siblings('.qt');
        qt.text(parseInt(qt.text()) + 1);
        changeVal($(this));
    });

    $(".qt-minus").click(function () {
        const qt = $(this).siblings('.qt');
        if (parseInt(qt.text()) > 1) {
            qt.text(parseInt(qt.text()) - 1);
            changeVal($(this));
        }
    });
});

function changeVal(el) {
    const qt = parseInt(el.siblings('.qt').text());
    const price = parseFloat(el.closest('.content').find('.full-price').data('price'));
    const fullPrice = (price * qt).toFixed(2);
    el.closest('.content').find('.full-price').text(`${fullPrice}€`);
    changeTotal();
}

function changeTotal() {
    let subtotal = 0;
    $(".full-price").each(function () {
        subtotal += parseFloat($(this).text());
    });
    updateCartTotals(subtotal);
}

//add to cart end .......


//payment 

