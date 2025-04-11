export default function Skills() {
  const skills = ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"]

  return (
    <section id="skills" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">My Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <p className="text-center text-gray-800">{skill}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
