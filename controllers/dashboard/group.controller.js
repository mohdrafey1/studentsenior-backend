// whatsappGroup.js
const WhatsappGroup = require('../../models/WhatsappGroup');
const Colleges = require('../../models/Colleges');

module.exports = {
    index: async (req, res) => {
        let Groups = await WhatsappGroup.find({}).populate('college');
        res.render('whatsappgroup/index.ejs', { Groups });
    },
    createGroupForm: async (req, res) => {
        const colleges = await Colleges.find();
        res.render('whatsappgroup/new.ejs', { colleges });
    },
    createGroup: async (req, res) => {
        const { title, info, domain, link, college, status } = req.body;
        const newGroup = new WhatsappGroup({
            title,
            info,
            domain,
            link,
            college,
            status,
        });
        await newGroup.save();
        req.flash('success', 'Group Created Successfully');
        return res.redirect(`/whatsappgroup`);
    },
    editGroupForm: async (req, res) => {
        const colleges = await Colleges.find();
        const { id } = req.params;
        const group = await WhatsappGroup.findById(id);
        if (!group) {
            req.flash('error', 'Group not found!');
            return res.redirect(`/whatsappgroup`);
        }
        res.render('whatsappgroup/edit', { group, colleges });
    },
    editGroup: async (req, res) => {
        const { id } = req.params;
        let { college, title, info, domain, link, status } = req.body;

        const updateData = {
            college,
            title,
            info,
            domain,
            link,
            status: status === 'true',
        };

        const updatedGroup = await WhatsappGroup.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
            }
        );

        if (!updatedGroup) {
            req.flash('error', 'PYQ not found');
            return res.redirect('/whatsappgroup');
        }

        req.flash('success', 'Updated Successfully');
        res.redirect(`/whatsappgroup`);
    },
    deleteGroup: async (req, res) => {
        await WhatsappGroup.findByIdAndDelete(req.params.id);
        res.redirect(`/whatsappgroup`);
    },
};
