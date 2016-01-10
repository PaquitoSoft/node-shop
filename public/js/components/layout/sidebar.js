import React from 'react';
import CatalogStore from '../../stores/catalog-store';

class Sidebar extends React.Component {
    constructor() {
        super();
        this.state = { categories: [] };
    }

    componentDidMount() {
        CatalogStore.getCategories().then(categories => {
            console.log('These are the categories:', categories);
            this.setState({categories});
        });
    }

    render() {
        //let categories = props.categories.map(category => {
        let categories = this.state.categories.map(category => {
            let subcategories = [];

            if (category.subcategories && category.subcategories.length) {
                category.subcategories.map(subcategory => {
                    // TODO Mark selected category
                    return (<a href="#" className="_subcategory {subcategory.selected ? 'selected' : ''}" data-categoryId="{subcategory.id}">{subcategory.name} </a>);
                });
            }

            return (
                <li>
                    <a href="#" className="accordion-button _rootCategory" data-categoryId="{_id}">{name}
                        <span>+</span>
                    </a>
                    <div className="accordion-content {@ne key=_id value=parentCategoryId}invisible{/ne}">
                        {subcategories}
                    </div>
                </li>
            );
        });

        return (
            <div id="sidebar" className="three columns" data-controller="main-navigation-controller">
                <nav>
                    <a href="#" id="toggle-menu" className="mobile"><span>Menu</span></a>
                        <ul id="main-menu" className="accordion">
                            {categories}
                        </ul>

                        <div id="social">
                            <a href="http://www.facebook.com/" target="_blank" className="facebook "></a>
                            <a href="http://www.twitter.com/" target="_blank" className="twitter "></a>
                            <a href="http://www.instagram.com/" target="_blank" className="instagram "></a>
                            <a href="http://www.pinterest.com/" target="_blank" className="pinterest "></a>
                            <a href="#" className="rss"></a>
                        </div>
                </nav>
            </div>
        );
    }
}

export default Sidebar;
