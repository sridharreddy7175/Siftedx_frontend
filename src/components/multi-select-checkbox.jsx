import React, { Component } from 'react';

export default class MultiSelectCheckbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canShowItems: false,
            checkedList: [],
            selectedItems: [],
            availableOptions: this.props.config.options
        }
    }

    componentDidMount() {
        const selectedItems = [];
        for (let index = 0; index < this.props.config.selected.length; index++) {
            const element = this.props.config.selected[index];
            const item = this.state.availableOptions.find(el => el.value == element);
            if (item) {
                selectedItems.push(item);
            }
        }
        this.setState({ ...this.state, selectedItems: selectedItems });
    }

    toggleItems() {
        this.setState({ ...this.state, canShowItems: !this.state.canShowItems });
    }

    selectedCheckBox(event, item) {
        const selectedItems = this.state.selectedItems;
        const itemIndex = selectedItems.findIndex(el => el.value === item.value);
        if (event.target.checked) {
            if (itemIndex < 0) {
                selectedItems.push(item);
            }
        } else {
            if (itemIndex >= 0) {
                selectedItems.splice(itemIndex, 1);
            }
        }

        if (item.value === "content-feed-info" || item.value === "content-feed-close" || item.value === "content-feed-acknowledge") {
            this.setState({ ...this.state, selectedItems: selectedItems, canShowItems: false });
        } else {
            this.setState({ ...this.state, selectedItems: selectedItems });
        }

        this.props.checkedItem(this.state.selectedItems);
    }

    onSearch(event) {
        const searchTerm = event.target.value;
        const filteredOptions = this.props.config.options.filter(el => {
            const index = el.label.indexOf(searchTerm);
            return el.label.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
        this.setState({ ...this.state, availableOptions: filteredOptions });
    }

    handleCheckbox(item) {
        const selectedItems = this.state.selectedItems;
        const itemIndex = selectedItems.findIndex(el => el.value === item.value);
        return itemIndex >= 0 ? true : null;
    }

    render() {
        return (
            <div className="m-multi-select-checkbox">
                {this.state.canShowItems && <div onClick={() => this.toggleItems()} className="m-overlay"></div>}
                {this.state.selectedItems.length < 1 && <div className="placeholder" onClick={() => this.toggleItems()}>
                    <i className="fa fa-angle-down arrow-icon" aria-hidden="true"></i>
                    {this.props.config.placeholder}
                </div>
                }
                {this.state.selectedItems.length > 0 && <div className="placeholder" onClick={() => this.toggleItems()}>
                    {this.state.selectedItems.length} Selected
                    <i className="fa fa-angle-down arrow-icon" aria-hidden="true"></i>
                </div>
                }
                {
                    this.state.canShowItems &&
                    <div className="options-container">
                        <input type="text" className="m-search-box m-search-focus" onInput={(event) => this.onSearch(event)} />
                        <ul className="options-list">
                            {this.state.availableOptions.map((item, i) => (
                                <li key={i} >
                                    <input type="checkbox" id={`checkbox-${i}`} defaultChecked={this.handleCheckbox(item)} onChange={(event) => this.selectedCheckBox(event, item)} />
                                    <label htmlFor={`checkbox-${i}`}>
                                        {item.label}
                                    </label>
                                </li>
                            ))
                            }
                        </ul>
                    </div>
                }
            </div>
        )
    }
}
