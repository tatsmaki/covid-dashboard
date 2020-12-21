class List {
  constructor(countries) {
    this.countries = countries;
  }

  displayButtons() {
    this.valueTypeElement = document.createElement('select');
    this.periodButton = document.createElement('button');
    this.buttons = document.createElement('div');
    const selectStatus = document.createElement('span');
    const prev = document.createElement('button');
    const next = document.createElement('button');
    const status = document.createElement('span');

    const valueArray = ['absolute values', 'relative values, per 100000', 'percentage values, %'];
    valueArray.forEach((item) => {
      const el = document.createElement('option');
      el.value = item;
      el.textContent = item;
      if (item.includes('absolute')) {
        el.selected = true;
      }
      this.valueTypeElement.append(el);
    });

    this.periodButton.classList.add('period-button');
    this.valueTypeElement.classList.add('value-type');
    this.buttons.classList.add('status-btns');
    status.classList.add('link');

    prev.textContent = '<';
    next.textContent = '>';
    status.textContent = 'Confirmed';
    this.periodButton.textContent = 'new day';
    status.classList.add('link');

    this.buttons.append(selectStatus);
    selectStatus.append(prev, status, next);

    return {
      node: this.buttons,
      period: this.periodButton,
      valueType: this.valueTypeElement,
      case: status,
    };
  }

  sortBy(date, status) {
    this.date = date;
    this.status = status;
    this.countries = Object.values(this.countries)
      .sort((a, b) => b[`${date}${status}`] - a[`${date}${status}`])
      .reduce((acc, cur) => {
        acc[cur.CountryCode] = cur;
        return acc;
      }, {});
  }

  displayList() {
    this.list = document.createElement('ol');
    this.list.classList.add('list');
    Object.values(this.countries).forEach((country) => this.createListItem(country));
    return this.list;
  }

  createListItem(country) {
    const listItem = document.createElement('li');
    const nameWithFlag = document.createElement('span');
    const flag = document.createElement('img');
    const name = document.createElement('span');
    const cases = document.createElement('span');

    listItem.setAttribute('data-country', country.CountryCode);
    listItem.setAttribute('data-search', country.Country.toLowerCase());
    flag.src = country.svg;
    name.textContent = country.Country;
    cases.textContent = country[`${this.date}${this.status}`];

    listItem.append(nameWithFlag, cases);
    nameWithFlag.append(flag, name);
    this.list.appendChild(listItem);
  }
}

export default List;
