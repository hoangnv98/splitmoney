import { useState } from "react";

function ExpenseSplitter() {
  const [participants, setParticipants] = useState([
    { id: 1, name: "", expenses: [] },
  ]);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    paidBy: 1,
    splitBetween: [], // Initialize as empty array
  });

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { id: participants.length + 1, name: "", expenses: [] },
    ]);
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const handleNameChange = (id, name) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    const expense = {
      id: expenses.length + 1,
      ...newExpense,
      amount: parseFloat(newExpense.amount),
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      description: "",
      amount: "",
      paidBy: 1,
      splitBetween: newExpense.splitBetween, // Maintain the splitBetween array
    });
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const calculateSplits = () => {
    const balances = participants.map((person) => ({
      id: person.id,
      name: person.name,
      paid: 0,
      owes: 0,
    }));

    expenses.forEach((expense) => {
      const payer = balances.find((b) => b.id === expense.paidBy);
      if (payer) {
        payer.paid += expense.amount;
      }

      const splitAmount = expense.amount / expense.splitBetween?.length;
      expense.splitBetween?.forEach((personId) => {
        const person = balances.find((b) => b.id === personId);
        if (person) {
          person.owes += splitAmount;
        }
      });
    });

    return balances.map((balance) => ({
      ...balance,
      balance: balance.paid - balance.owes,
    }));
  };

  return (
    <div className=" place-content-center w-full mx-auto p-4 sm:p-6 ">
      <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center">
        Chia tiền
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Participants Section */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Người tham gia
          </h2>
          <div className="space-y-3">
            {participants.map((person) => (
              <div key={person.id} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => handleNameChange(person.id, e.target.value)}
                  placeholder="Tên người tham gia"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {participants.length > 1 && (
                  <button
                    onClick={() => removeParticipant(person.id)}
                    class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4" />
          <button
            type="button"
            onClick={addParticipant}
            class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Thêm người tham gia
          </button>
        </div>
        {/* Expenses Section */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Chi tiêu</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
              placeholder="Mô tả chi tiêu"
              className="w-full p-2 border rounded text-sm sm:text-base"
            />
            <input
              type="number"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              placeholder="Số tiền"
              className="w-full p-2 border rounded text-sm sm:text-base"
            />
            <select
              value={newExpense.paidBy}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  paidBy: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border rounded text-sm sm:text-base"
            >
              {participants.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name || `Người ${person.id}`}
                </option>
              ))}
            </select>

            <div className="space-y-2">
              <p className="font-medium text-sm sm:text-base">Chia cho:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-sm sm:text-base">
                  <input
                    type="checkbox"
                    checked={
                      newExpense.splitBetween?.length === participants.length
                    }
                    onChange={(e) => {
                      const newSplitBetween = e.target.checked
                        ? participants.map((p) => p.id)
                        : [];
                      setNewExpense({
                        ...newExpense,
                        splitBetween: newSplitBetween,
                      });
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span>Chia cho tất cả {participants.length} người</span>
                </label>
                {participants.map((person) => (
                  <label
                    key={person.id}
                    className="flex items-center gap-2 text-sm sm:text-base"
                  >
                    <input
                      type="checkbox"
                      checked={newExpense.splitBetween?.includes(person.id)}
                      onChange={(e) => {
                        const newSplitBetween = e.target.checked
                          ? [...(newExpense.splitBetween || []), person.id]
                          : newExpense.splitBetween?.filter(
                              (id) => id !== person.id
                            ) || [];
                        setNewExpense({
                          ...newExpense,
                          splitBetween: newSplitBetween,
                        });
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {person.name || `Người ${person.id}`}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={addExpense}
              //   disabled={
              //     !newExpense.description ||
              //     !newExpense.amount ||
              //     newExpense.splitBetween?.length === 0
              //   }
              class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Thêm chi tiêu
            </button>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Danh sách chi tiêu
        </h2>
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white p-3 sm:p-4 rounded-lg shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="text-sm sm:text-base font-medium">
                  {expense.description}
                </div>
                <div className="text-sm sm:text-base">
                  {expense.amount.toLocaleString()}đ
                </div>
                <div className="text-sm sm:text-base">
                  Trả bởi:{" "}
                  {participants.find((p) => p.id === expense.paidBy)?.name ||
                    `Người ${expense.paidBy}`}
                </div>
                <div className="text-sm sm:text-base">
                  Chia cho:{" "}
                  {expense.splitBetween
                    ?.map(
                      (id) =>
                        participants.find((p) => p.id === id)?.name ||
                        `Người ${id}`
                    )
                    .join(", ")}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeExpense(expense.id)}
                class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Kết quả</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {calculateSplits().map((balance) => (
            <div key={balance.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm sm:text-base font-medium">
                {balance.name || `Người ${balance.id}`}
              </div>
              <div
                className={`text-sm sm:text-base mt-1 ${
                  balance.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {Math.floor(Math.abs(balance.balance)).toLocaleString()}đ
                {balance.balance >= 0 ? " nhận lại" : " cần trả"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExpenseSplitter;
