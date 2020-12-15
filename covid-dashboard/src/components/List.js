class List {
  constructor(countries) {
    this.countries = countries;
  }

  displayList() {
    this.list = document.createElement('ol');
    this.list.classList.add('list');
    this.countries.forEach((country) => this.createListItem(country));
    return this.list;
  }

  createListItem(country) {
    const listItem = document.createElement('li');
    listItem.setAttribute('data-country', country.CountryCode);
    listItem.innerHTML = `<span>${country.Country}</span><span>${country.TotalConfirmed}</span>`;
    this.list.appendChild(listItem);
  }
}

export default List;
