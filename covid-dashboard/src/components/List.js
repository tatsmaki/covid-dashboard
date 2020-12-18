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
    const wrap = document.createElement('span');
    const flag = document.createElement('img');
    const name = document.createElement('span');
    const cases = document.createElement('span');

    listItem.setAttribute('data-country', country.CountryCode);
    listItem.setAttribute('data-search', country.Country.toLowerCase());
    flag.src = country.svg;
    name.textContent = country.Country;
    cases.textContent = country.TotalConfirmed;
    
    listItem.appendChild(wrap);
    wrap.appendChild(flag);
    wrap.appendChild(name);
    listItem.appendChild(cases);
    this.list.appendChild(listItem);
  }
}

export default List;
