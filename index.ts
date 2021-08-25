import './style.scss';

interface ICategory {
  key: string;
  label: string;
  sort?: number;
  parent?: string;
}

interface IEntityType {
  name: string;
  sort?: number;
  category?: string;
  url: string;
}

const categories: ICategory[] = [
  { key: 'search', label: 'Search', sort: 1 },
  { key: 'address-search', label: 'Address search', sort: 2, parent: 'search' },
  {
    key: 'position-search',
    label: 'Position search',
    sort: 1,
    parent: 'search'
  },
  { key: 'settings', label: 'Settings', sort: 99 }
];

const entityTypes: IEntityType[] = [
  { name: 'Home', url: '/' },
  {
    name: 'Employee search',
    category: 'position-search',
    url: '/search/position-search/employee'
  },
  { name: 'Users', category: 'settings', url: '/settings/user' },
  {
    name: 'Street address search',
    category: 'address-search',
    url: '/search/address-search/street'
  },
  {
    name: 'City search',
    sort: 1,
    category: 'address-search',
    url: '/search/address-search/city'
  }
];

const desiredOutcome = [
  {
    class: 'category',
    name: 'Search',
    children: [
      {
        class: 'category',
        name: 'Position search',
        children: [
          {
            class: 'entity',
            name: 'Employee search',
            url: '/search/position-search/employee'
          }
        ]
      },
      {
        class: 'category',
        name: 'Address search',
        children: [
          {
            class: 'entity',
            name: 'City search',
            url: '/search/address-search/city'
          },
          {
            class: 'entity',
            name: 'Street address search',
            url: '/search/address-search/street'
          }
        ]
      }
    ]
  },
  {
    class: 'entity',
    name: 'Home',
    url: '/'
  },
  {
    class: 'category',
    name: 'Settings',
    children: [
      {
        class: 'entity',
        name: 'Users',
        url: '/settings/user'
      }
    ]
  }
];

// Place your solution in the `results` constant here.
const entresults = (key, entityTypes, reusltItem) => {
  entityTypes.forEach((elm, j) => {
    if (key == elm.category) {
      reusltItem.children.push({
        class: 'entity',
        name: elm.name,
        url: elm.url
      });
    }
  });
};

const getResults = (categories, entityTypes) => {
  return categories.reduce((acc, val, ind, array) => {
    const parentItem = { class: '', name: '', children: [] };
    parentItem.class = 'category';
    parentItem.name = val.label;
    var getChild = entresults(val.key, entityTypes, parentItem);
    if (getChild) parentItem.children.push(getChild);
    const childs = [];
    array.sort(function(a, b) {
      var keyA = a.sort,
        keyB = b.sort;
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    array.sort().forEach((el, i) => {
      if (childs.includes(el.parent) || el.parent === val.key) {
        const childItem = { class: '', name: '', children: [] };
        childItem.class = 'category';
        childItem.name = el.label;
        entresults(el.key, entityTypes, childItem);
        parentItem.children.push(childItem);
      }
    });

    if (val.parent) {
      return acc;
    } else {
      return acc.concat(parentItem);
    }
  }, []);
};
var results = getResults(categories, entityTypes);

const searchEntWithoutCat = results => {
  entityTypes.forEach((elm, j) => {
    if (!elm.category) {
      results.push({
        class: 'entity',
        name: elm.name,
        url: elm.url
      });
    }
  });
};
searchEntWithoutCat(results);
console.log(results);

//Do not modify the below code. It simply outputs the result.
document.querySelector('#results').innerHTML = JSON.stringify(
  results,
  null,
  '    '
);
const note = document.querySelector('#note');
note.classList.add('no-match');
note.innerHTML =
  'Depeloper Note : the result is same as desired output but the class positioning is different.';

const doesMatchEl = document.querySelector('#doesMatch');
if (JSON.stringify(desiredOutcome) === JSON.stringify(results)) {
  doesMatchEl.classList.add('match');
  doesMatchEl.innerHTML = 'Matches! Congratulations.';
} else {
  doesMatchEl.classList.add('no-match');
  doesMatchEl.innerHTML = 'Does not match, keep trying.';
}
