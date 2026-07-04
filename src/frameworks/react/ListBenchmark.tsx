import React, { useState, useMemo, useCallback, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';

interface Item {
  id: number;
  label: string;
  selected: boolean;
}

interface ListAppProps {
  onAction: (action: string, data?: any) => void;
}

const ListApp: React.FC<ListAppProps> = ({ onAction }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [filterText, setFilterText] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const actionsRef = useRef({ items, setItems });

  // Update ref to expose actions
  React.useEffect(() => {
    actionsRef.current = { items, setItems };
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!filterText) return items;
    return items.filter(item =>
      item.label.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [items, filterText]);

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
    setItems(prev => prev.map(item => ({
      ...item,
      selected: item.id === id
    })));
  }, []);

  const handleRemove = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleUpdate = useCallback((id: number, newLabel: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, label: newLabel } : item
    ));
  }, []);

  // Expose methods for benchmarking
  React.useImperativeHandle(onAction as any, () => ({
    setItems,
    getItems: () => items
  }), [items]);

  return (
    <div className="list-benchmark">
      <div className="controls">
        <input
          type="text"
          placeholder="Filter items..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <span className="count">
          Items: {items.length} / Filtered: {filteredItems.length}
        </span>
      </div>
      <ul className="item-list">
        {filteredItems.map((item) => (
          <li
            key={item.id}
            className={item.selected ? 'selected' : ''}
            onClick={() => handleSelect(item.id)}
          >
            <span className="id">#{item.id}</span>
            <span className="label">{item.label}</span>
            <button
              className="update-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdate(item.id, `Updated ${Date.now()}`);
              }}
            >
              Update
            </button>
            <button
              className="remove-btn"
              onClick={(e) => {
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

export class ReactListBenchmark {
  private root: Root | null = null;
  private container: HTMLElement | null = null;
  private nextId = 1;
  private setItems: ((items: Item[] | ((prev: Item[]) => Item[])) => void) | null = null;
  private getItems: (() => Item[]) | null = null;

  setup(container: HTMLElement) {
    this.container = container;
    this.root = createRoot(container);
    
    const actionHandler = {
      current: null as any
    };

    this.root.render(
      <ListApp onAction={actionHandler as any} />
    );

    // Store references to state setters
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.setItems = actionHandler.current?.setItems;
        this.getItems = actionHandler.current?.getItems;
        resolve();
      }, 100);
    });
  }

  private getCurrentItems(): Item[] {
    return this.getItems ? this.getItems() : [];
  }

  create(count: number) {
    if (!this.setItems) return;
    
    const newItems: Item[] = [];
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: this.nextId++,
        label: `Item ${this.nextId} - ${Math.random().toString(36).substr(2, 9)}`,
        selected: false
      });
    }
    this.setItems(newItems);
  }

  append(count: number) {
    if (!this.setItems) return;
    
    this.setItems(prev => {
      const newItems: Item[] = [...prev];
      for (let i = 0; i < count; i++) {
        newItems.push({
          id: this.nextId++,
          label: `Appended ${this.nextId}`,
          selected: false
        });
      }
      return newItems;
    });
  }

  prepend(count: number) {
    if (!this.setItems) return;
    
    this.setItems(prev => {
      const newItems: Item[] = [];
      for (let i = 0; i < count; i++) {
        newItems.push({
          id: this.nextId++,
          label: `Prepended ${this.nextId}`,
          selected: false
        });
      }
      return [...newItems, ...prev];
    });
  }

  insertAt(index: number, count: number) {
    if (!this.setItems) return;
    
    this.setItems(prev => {
      const newItems: Item[] = [];
      for (let i = 0; i < count; i++) {
        newItems.push({
          id: this.nextId++,
          label: `Inserted ${this.nextId}`,
          selected: false
        });
      }
      const result = [...prev];
      result.splice(index, 0, ...newItems);
      return result;
    });
  }

  remove(count: number) {
    if (!this.setItems) return;
    
    this.setItems(prev => {
      const result = [...prev];
      for (let i = 0; i < count && result.length > 0; i++) {
        const index = Math.floor(Math.random() * result.length);
        result.splice(index, 1);
      }
      return result;
    });
  }

  updateRandom(count: number) {
    if (!this.setItems) return;
    
    this.setItems(prev => {
      const result = [...prev];
      for (let i = 0; i < count && result.length > 0; i++) {
        const index = Math.floor(Math.random() * result.length);
        result[index] = {
          ...result[index],
          label: `Updated ${Date.now()}`
        };
      }
      return result;
    });
  }

  swap(index1: number, index2: number) {
    if (!this.setItems) return;
    
    this.setItems(prev => {
      if (index1 < prev.length && index2 < prev.length) {
        const result = [...prev];
        const temp = result[index1];
        result[index1] = result[index2];
        result[index2] = temp;
        return result;
      }
      return prev;
    });
  }

  clear() {
    if (!this.setItems) return;
    this.setItems([]);
  }

  sort() {
    if (!this.setItems) return;
    
    this.setItems(prev => {
      return [...prev].sort((a, b) => a.label.localeCompare(b.label));
    });
  }

  filter(text: string) {
    // Filter is handled by component state
    // This is just for API compatibility
  }

  selectRandom() {
    if (!this.setItems) return;
    
    this.setItems(prev => {
      if (prev.length > 0) {
        const index = Math.floor(Math.random() * prev.length);
        return prev.map((item, i) => ({
          ...item,
          selected: i === index
        }));
      }
      return prev;
    });
  }

  teardown() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}