/** @jsx createElement */
import { createElement, createRoot, RxList, atom, computed, Fragment } from 'axii';

interface Item {
  id: number;
  label: atom<string>;
  selected: atom<boolean>;
}

export class AxiiListBenchmark {
  private root: ReturnType<typeof createRoot> | null = null;
  private items: RxList<Item>;
  private selectedId = atom<number | null>(null);
  private filterText = atom('');
  private nextId = 1;

  constructor() {
    this.items = new RxList<Item>([]);
  }

  setup(container: HTMLElement) {
    this.root = createRoot(container);
    this.render();
  }

  private render() {
    if (!this.root) return;

    const ListApp = ({}, { createElement }: any) => {
      const filteredItems = computed(() => {
        const filter = this.filterText();
        if (!filter) return this.items;
        
        return this.items.filter(item => 
          item.label().toLowerCase().includes(filter.toLowerCase())
        );
      });

      const handleSelect = (id: number) => {
        this.selectedId(id);
        const item = this.items.find(item => item.id === id);
        if (item) {
          // Reset all selections
          this.items.forEach(i => i.selected(false));
          item.selected(true);
        }
      };

      const handleRemove = (id: number) => {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      };

      const handleUpdate = (id: number, newLabel: string) => {
        const item = this.items.find(item => item.id === id);
        if (item) {
          item.label(newLabel);
        }
      };

      return (
        <div className="list-benchmark">
          <div className="controls">
            <input
              type="text"
              placeholder="Filter items..."
              value={this.filterText}
              onInput={(e: any) => this.filterText(e.target.value)}
            />
            <span className="count">
              Items: {() => this.items.length} / 
              Filtered: {() => filteredItems().length}
            </span>
          </div>
          <ul className="item-list">
            {() => filteredItems().map((item: Item) => (
              <li 
                key={item.id}
                className={() => item.selected() ? 'selected' : ''}
                onClick={() => handleSelect(item.id)}
              >
                <span className="id">#{item.id}</span>
                <span className="label">{() => item.label()}</span>
                <button 
                  className="update-btn"
                  onClick={(e: Event) => {
                    e.stopPropagation();
                    handleUpdate(item.id, `Updated ${Date.now()}`);
                  }}
                >
                  Update
                </button>
                <button 
                  className="remove-btn"
                  onClick={(e: Event) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    };

    this.root.render(<ListApp />);
  }

  // Benchmark operations
  create(count: number) {
    const newItems: Item[] = [];
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: this.nextId++,
        label: atom(`Item ${this.nextId} - ${Math.random().toString(36).substr(2, 9)}`),
        selected: atom(false)
      });
    }
    this.items.push(...newItems);
  }

  append(count: number) {
    const newItems: Item[] = [];
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: this.nextId++,
        label: atom(`Appended ${this.nextId}`),
        selected: atom(false)
      });
    }
    this.items.push(...newItems);
  }

  prepend(count: number) {
    const newItems: Item[] = [];
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: this.nextId++,
        label: atom(`Prepended ${this.nextId}`),
        selected: atom(false)
      });
    }
    this.items.unshift(...newItems);
  }

  insertAt(index: number, count: number) {
    const newItems: Item[] = [];
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: this.nextId++,
        label: atom(`Inserted ${this.nextId}`),
        selected: atom(false)
      });
    }
    this.items.splice(index, 0, ...newItems);
  }

  remove(count: number) {
    // Remove random items
    for (let i = 0; i < count && this.items.length > 0; i++) {
      const index = Math.floor(Math.random() * this.items.length);
      this.items.splice(index, 1);
    }
  }

  updateRandom(count: number) {
    for (let i = 0; i < count && this.items.length > 0; i++) {
      const index = Math.floor(Math.random() * this.items.length);
      const item = this.items[index];
      if (item) {
        item.label(`Updated ${Date.now()}`);
      }
    }
  }

  swap(index1: number, index2: number) {
    if (index1 < this.items.length && index2 < this.items.length) {
      const temp = this.items[index1];
      this.items[index1] = this.items[index2];
      this.items[index2] = temp;
    }
  }

  clear() {
    this.items.splice(0, this.items.length);
  }

  sort() {
    const sorted = [...this.items].sort((a, b) => 
      a.label().localeCompare(b.label())
    );
    this.items.splice(0, this.items.length, ...sorted);
  }

  filter(text: string) {
    this.filterText(text);
  }

  selectRandom() {
    if (this.items.length > 0) {
      const index = Math.floor(Math.random() * this.items.length);
      const item = this.items[index];
      if (item) {
        this.items.forEach(i => i.selected(false));
        item.selected(true);
        this.selectedId(item.id);
      }
    }
  }

  teardown() {
    if (this.root) {
      this.root.destroy();
      this.root = null;
    }
    this.items.splice(0, this.items.length);
  }
}