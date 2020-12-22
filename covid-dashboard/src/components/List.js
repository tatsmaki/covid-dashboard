import * as calcHelp from '../helpers/calcHelp';

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
    this.periodButton.textContent = 'Total';
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

  sortBy(date, status, view) {
    this.view = view;
    this.period = date;
    this.status = status;
    const sortedCountries = Object.values(JSON.parse(JSON.stringify(this.countries)));
    sortedCountries
      .reduce((acc, cur) => {
        const country = cur;
        if (view.includes('relative')) {
          country[`${date}${status}`] = calcHelp.calculateRelativeData(country, country.population, status, date);
        }
        if (view.includes('percentage')) {
          country[`${date}${status}`] = calcHelp.calculatePercentageData(country, country.population, status, date);
        }
        acc.push(country);
        return acc;
      }, []);

    sortedCountries
      .sort((a, b) => b[`${date}${status}`] - a[`${date}${status}`])
      .reduce((acc, cur) => {
        acc[cur.CountryCode] = cur;
        return acc;
      }, {});
    this.countriesToCreate = { ...sortedCountries };
  }

  displayList() {
    this.list = document.createElement('ol');
    this.list.classList.add('list');
    Object.values(this.countriesToCreate).forEach((country) => this.createListItem(country));
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

//     cases.textContent = country.TotalConfirmed;
//     listItem.appendChild(wrap);
//     wrap.appendChild(flag);
//     wrap.appendChild(name);
//     listItem.appendChild(cases);

    cases.textContent = country[`${this.period}${this.status}`];

    listItem.append(nameWithFlag, cases);
    nameWithFlag.append(flag, name);
    this.list.appendChild(listItem);
  }
}

export default List;
