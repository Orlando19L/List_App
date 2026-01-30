const Input = document.getElementById('Input');
const Add = document.getElementById('Add');
const Select = document.getElementById('Select');
const List = document.getElementById('List');

const initialState = {
  items: [],
  filter: 'all',
  nextId: 1
};

let state = { ...initialState };


Add.addEventListener('click', () => {
  if (Input.value.trim() === '') return;
  dispatch('ADD_ITEM', Input.value);
  Input.value = '';
});

Select.addEventListener('change', () => {
    dispatch('SET_FILTER',Select.value);
})


function dispatch(type, payload) {
  state = reducer(state, { type, payload });
  render(state);
}

function reducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    return { 
      ...state,
      items: [
        ...state.items,
        {
          id: state.nextId,
          text: action.payload,
          completed: false,
        }
      ],
      nextId: state.nextId + 1
    };
  }

  if (action.type === 'REMOVE_ITEM') {
    return {
      ...state,
      items: state.items.filter(item => item.id !== action.payload)
    };
  }

  if(action.type === 'TOGGLE_ITEM'){
    return {
      ...state,
      items: state.items.map(item =>
      item.id === action.payload
      ? { ...item, completed: !item.completed }
      : item
  )}
  }

  if(action.type === 'SET_FILTER'){
    return{
      ...state,
      filter: action.payload
    }
  }
  
  return state;
}


function getVisibleItems(state) {
  if(state.filter === 'all'){
    return state.items;
  }
  if(state.filter ==='completed'){
    return state.items.filter(item => item.completed);
  }
  if(state.filter === 'uncompleted'){
    return state.items.filter(item => !item.completed);
  }
}

function render(state) {
  while (List.firstChild) {
    List.removeChild(List.firstChild);
  }

  const visibleItems = getVisibleItems(state);

  visibleItems.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.text;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    checkbox.addEventListener('change', () => {
      dispatch('TOGGLE_ITEM', item.id);
    });

    if (item.completed) {
      li.style.textDecoration = 'line-through';
    } else {
      li.style.textDecoration = 'none';
    }

    const btn = document.createElement('button');
    btn.textContent = 'X';
    btn.addEventListener('click', () => {
      dispatch('REMOVE_ITEM', item.id);
    });

    li.prepend(checkbox);
    li.appendChild(btn);
    List.appendChild(li);
  })
}
  

