import React, { useState } from 'react';
import './Addproduct.css';
import Upload_area from '../../assets/upload_area.png';

function Addproduct() {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        new_price: "",
        old_price: "",
        category: "women",
        image: '',
        description: '',
        tag: "modern", // Default tag
        brand: "nike", // Default brand
        sizes: [] // Initialize as an empty array
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const handleSizeCheckboxChange = (e) => {
        const size = e.target.value;
        const isChecked = e.target.checked;

        setProductDetails(prevDetails => {
            let updatedSizes = prevDetails.sizes;

            if (isChecked) {
                updatedSizes = [...updatedSizes, size]; // Add size if checked
            } else {
                updatedSizes = updatedSizes.filter(s => s !== size); // Remove size if unchecked
            }

            return { ...prevDetails, sizes: updatedSizes };
        });
    };

    const resetFields = () => {
        setProductDetails({
            name: "",
            new_price: "",
            old_price: "",
            category: "women",
            image: '',
            description: '',
            tag: "modern", // Reset to default tag
            brand: "nike", // Reset to default brand
            sizes: [] // Reset sizes
        });
        setImage(null);
    };

    const Add_product = async () => {
        let responseData;
        let product = { ...productDetails }; // Ensure to use spread operator
        console.log(product);

        let formData = new FormData();
        formData.append('product', image);

        await fetch('http://localhost:4001/upload', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData
        }).then((resp) => resp.json()).then((data) => { responseData = data });

        if (responseData.success) {
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4001/addproduct', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product)
            }).then((resp) => resp.json()).then((data) => {
                if (data.success) {
                    alert('Product successfully added');
                    resetFields(); // Reset all fields after successful upload
                } else {
                    alert('Failed to add product');
                }
            });
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input type="text" value={productDetails.name} onChange={changeHandler} name="name" placeholder="Type here" />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input type="number" value={productDetails.old_price} onChange={changeHandler} name="old_price" placeholder="Type here" />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer price</p>
                    <input type="number" value={productDetails.new_price} onChange={changeHandler} name="new_price" placeholder="Type here" />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product category</p>
                <select name="category" value={productDetails.category} onChange={changeHandler} className='add-product-selector'>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kid">Kids</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Product tag</p>
                <select name="tag" value={productDetails.tag} onChange={changeHandler} className='add-product-selector'>
                    <option value="modern">Modern</option>
                    <option value="latest">Latest</option>
                    <option value="brand">Brand</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Product brand</p>
                <select name="brand" value={productDetails.brand} onChange={changeHandler} className='add-product-selector'>
                    <option value="nike">Nike</option>
                    <option value="reebok">Reebok</option>
                    <option value="givenchy">Givenchy</option>
                    <option value="louis_vuitton">Louis Vuitton</option>
                    <option value="adidas">Adidas</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Product size</p>
                <div className="addproduct-sizes">
                    <label>
                        <input
                            type="checkbox"
                            value="S"
                            checked={productDetails.sizes.includes("S")}
                            onChange={handleSizeCheckboxChange}
                        />
                        S
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="M"
                            checked={productDetails.sizes.includes("M")}
                            onChange={handleSizeCheckboxChange}
                        />
                        M
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="L"
                            checked={productDetails.sizes.includes("L")}
                            onChange={handleSizeCheckboxChange}
                        />
                        L
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="XL"
                            checked={productDetails.sizes.includes("XL")}
                            onChange={handleSizeCheckboxChange}
                        />
                        XL
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="XXL"
                            checked={productDetails.sizes.includes("XXL")}
                            onChange={handleSizeCheckboxChange}
                        />
                        XXL
                    </label>
                </div>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : Upload_area} className='addproduct-thumbnail-img' alt="" />
                </label>
                <input onChange={imageHandler} type="file" id="file-input" name="image" hidden />
            </div>
            <div className="addproduct-itemfield">
                <p>Product description</p>
                <textarea
                    name="description"
                    value={productDetails.description}
                    onChange={changeHandler}
                    placeholder="Enter product description here"
                    rows="10" // Increase the number of rows for a longer description box
                    className='add-product-description'
                />
            </div>
            <button className='addproduct-btn' onClick={Add_product}>ADD</button>
        </div>
    );
}

export default Addproduct;
