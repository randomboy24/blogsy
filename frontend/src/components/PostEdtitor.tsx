import { Container } from "./Container";

export default function PostEditor() {
  return (
    <Container>
      <div>
        <label htmlFor="title">Title</label>
        <br />
        <input
          id="title"
          type="text"
          placeholder="enter the title"
          className="border p-1 rounded-md"
        />
      </div>
      <br />
      <br />
      <div>
        <textarea
          placeholder="enter the description"
          className="border p-1 rounded-md"
        ></textarea>
      </div>
    </Container>
  );
}
