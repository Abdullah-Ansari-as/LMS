import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { uploadNewCourse } from "../../api/courseApi";
import { toast } from "sonner";

const AddNewCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [creditHours, setCreditHours] = useState("");
  const [instructor, setInstructor] = useState({
    profilePicture: "",
    name: "",
    degree: "",
    university: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseName || !description || !creditHours || !instructor.name || !instructor.degree || !instructor.university || !instructor.profilePicture) {
      alert("Please fill all fields");
      return;
    }

    const newCourse = {
      courseName: courseName,
      description,
      creditHours: parseInt(creditHours),
      instructor,
    };

    try {
      setLoading(true);
      const result = await uploadNewCourse(newCourse); 
      if (result.success) {
        toast.success(result.message);
        setLoading(false);

        // Clear form
        setCourseName("");
        setDescription("");
        setCreditHours("");
        setInstructor({
          profilePicture: "",
          name: "",
          degree: "",
          university: "",
        });

      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }

  };

  return (
    <div className="bg-[#F2F3F8] h-auto md:h-full mt-0 md:pt-10 px-3 md:PX-7 p-6">
      <span onClick={() => navigate(-1)} className="hover:underline cursor-pointer inline-block"><div className="flex items-center">
        <IoIosArrowRoundBack /> back</div></span>
      <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
      <div className="max-w-3xl mx-auto bg-base-100 p-4 md:p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Course Name */}
          <div className="form-control">
            <label className="label font-medium pr-2">Course Name</label>
            <input
              type="text"
              className="input input-bordered"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g. JavaScript"
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label font-medium pr-2">Description</label>
            <input
              type="text"
              className="input input-bordered"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Computer Science/IT"
            />
          </div>

          {/* Credit Hours */}
          <div className="form-control">
            <label className="label font-medium pr-2">Credit Hours</label>
            <input
              type="number"
              className="input input-bordered"
              value={creditHours}
              onChange={(e) => setCreditHours(e.target.value)}
              placeholder="e.g. 3"
              min={1}
              max={6}
            />
          </div>

          {/* Instructor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label font-medium">Instructor Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={instructor.name}
                onChange={(e) =>
                  setInstructor({ ...instructor, name: e.target.value })
                }
                placeholder="e.g. Abdullah"
              />
            </div>
            <div className="form-control">
              <label className="label font-medium">Degree</label>
              <input
                type="text"
                className="input input-bordered"
                value={instructor.degree}
                onChange={(e) =>
                  setInstructor({ ...instructor, degree: e.target.value })
                }
                placeholder="e.g. PhD. Computer Science"
              />
            </div>
            <div className="form-control">
              <label className="label font-medium">University</label>
              <input
                type="text"
                className="input input-bordered"
                value={instructor.university}
                onChange={(e) =>
                  setInstructor({ ...instructor, university: e.target.value })
                }
                placeholder="e.g. Virtual University of Pakistan"
              />
            </div>
            <div className="form-control">
              <label className="label font-medium">Instructor Picture URL</label>
              <input
                type="text"
                className="input input-bordered"
                value={instructor.profilePicture}
                onChange={(e) =>
                  setInstructor({ ...instructor, profilePicture: e.target.value })
                }
                placeholder="https://picsum.photos/200/300"
              />
            </div>
          </div>

          <button className={`${loading ? "btn w-full mt-4 cursor-not-allowed bg-gray-300" : "btn btn-primary w-full mt-4"}`} type="submit">
            {loading ? "Loading..." : "Add Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewCourse;
