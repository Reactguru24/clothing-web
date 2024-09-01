import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import CloseIcon from '@mui/icons-material/Close';

function ListProduct() {
    const [allproducts, setAllproducts] = useState([]);

    const fetchInfo = async () => {
        await fetch('http://localhost:4001/allproducts')
            .then((res) => res.json())
            .then((data) => { setAllproducts(data) });
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const remove_product = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
            const response = await fetch('http://localhost:4001/removeproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });

            if (response.ok) {
                window.alert('Product deleted successfully.');
                fetchInfo(); // Refresh the product list
            } else {
                window.alert('Failed to delete the product.');
            }
        }
    };

    return (
        <div className='list-product'>
            <h1>All Product List</h1>
            <div className="listproduct-format-main">
                <p>Product</p>
                <p>Title</p>
                <p>Old Price</p>
                <p>New Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className="listproduct-allproduct">
                <hr />
                {allproducts.map((product, index) => (
                    <React.Fragment key={index}>
                        <div className="listproduct-format-main listproduct-format">
                            <img src={product.image} alt="" className='listproduct-product-icon' />
                            <p>{product.name}</p>
                            <p>${product.old_price}</p>
                            <p>${product.new_price}</p>
                            <p>{product.category}</p>
                            <p><button onClick={() => { remove_product(product.id) }} className='listproduct-remove-icon'><CloseIcon /></button></p>
                        </div>
                        <hr />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default ListProduct;
