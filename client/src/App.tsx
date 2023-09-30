import { Select, SelectItem } from "@nextui-org/react";
import types from "@/lib/share-types.json";
import { Textarea } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

export default function App() {
  return (
    <div className="p-5 min-h-screen w-full md:flex-nowrap gap-4 bg-slate-500">
      <Select label="Select an animal" className="max-w-xs">
        {types.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </Select>
      <Textarea
        isRequired
        label="Description"
        labelPlacement="outside"
        placeholder="Enter your description"
        className="max-w-xs"
      />
      <Button color="primary">Button</Button>
    </div>
  );
}
